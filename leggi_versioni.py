#!/usr/bin/env python3
"""
Legge la versione del software di server e proiettori dei cinema e la salva
in versioni.js, che la dashboard mostra accanto a ogni dispositivo.

Il browser non può farlo da solo (niente SNMP, niente risposte leggibili
dagli IP dei cinema): questo script va lanciato da un PC collegato alla VPN.

    python3 leggi_versioni.py            # solo i cinema in VPN (10.x)
    python3 leggi_versioni.py --tutti    # anche le reti locali 192.168.x
                                         # (servono solo se sei sul posto)
    python3 leggi_versioni.py --solo "Odeon"   # filtra per cinema/città/IP

Poi committare versioni.js: il sito si aggiorna da solo.

Metodi, gli stessi usati dal TMS:
  - Doremi / Dolby (DCP2000, DCP-2K4, ShowVault, IMS3000): SNMP, MIB Doremi
    (enterprise 24391) → versione software e firmware.
  - Barco ICMP / Alchemy: SOAP in HTTPS sulla porta 43758, Login e
    GetProductInformation. Servono le credenziali, da variabili d'ambiente:
        BARCO_USER=...  BARCO_PASSWORD=...
    (su Windows: set BARCO_USER=...). Non vanno mai scritte nel repository.
  - Proiettori e altri server: SNMP sysDescr (1.3.6.1.2.1.1.1.0), la
    descrizione standard che riporta modello e firmware.

Community SNMP: "public", oppure SNMP_COMMUNITY=... .
Solo libreria standard: nessuna dipendenza da installare.
"""

import argparse
import datetime
import http.client
import json
import os
import re
import socket
import ssl
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from xml.etree import ElementTree
from xml.sax.saxutils import escape

BASE_DIR    = Path(__file__).resolve().parent
DATA_PATH   = BASE_DIR / 'dati.js'
OUTPUT_PATH = BASE_DIR / 'versioni.js'

TIMEOUT   = 3
COMMUNITY = os.environ.get('SNMP_COMMUNITY', 'public')

OID_SYSDESCR      = '1.3.6.1.2.1.1.1.0'
OID_DOREMI_SW     = '1.3.6.1.4.1.24391.1.3.10.0'
OID_DOREMI_FW     = '1.3.6.1.4.1.24391.1.3.7.0'
BARCO_SMS_PORT    = 43758
BARCO_SMS_NS      = 'http://www.barco.com/sms/sms_1'


# ── dati.js ───────────────────────────────────────────────────────────────────
# Stesso parser del sito, ridotto a quello che serve: la chiave di ogni
# dispositivo deve coincidere con quella che la dashboard usa per cercarlo.
def leggi_dispositivi():
    source = DATA_PATH.read_text(encoding='utf-8')
    dispositivi = []
    for net in ('vpn', 'offline', 'estivi'):
        m = re.search(r'\b' + net + r':\s*`(.*?)`\s*,', source, re.DOTALL)
        if not m:
            raise ValueError(f'Blocco {net} non trovato in dati.js')
        for line in m.group(1).replace('\\t', '\t').splitlines():
            line = line.strip()
            if not line or line.startswith('//'):
                continue
            cols = line.split('\t')
            if len(cols) < 2 or (len(cols) > 2 and cols[2].strip() == 'GEO'):
                continue
            ip_porta = cols[1].strip()
            if not re.fullmatch(r'\d{1,3}(\.\d{1,3}){3}(:\d+)?', ip_porta):
                continue
            parts = cols[0].split(' - ')
            if len(parts) < 2:
                continue
            nome  = parts[0].strip()
            citta = re.sub(r'\s*-\s*[A-Z]{2}$', '', parts[1].strip()).strip()
            dev   = ' - '.join(parts[3:]).strip() or 'Unità'
            ip    = ip_porta.split(':')[0]
            dispositivi.append({
                'chiave': f'{nome}|{citta}|{net}|{ip}|{dev}',
                'cinema': nome, 'citta': citta, 'net': net, 'ip': ip, 'label': dev,
            })
    return dispositivi


# Stesse regole di devType() in index.html, solo per server e proiettori
def metodo_per(label):
    l = label.lower()
    if re.search(r'mikrotik|router|\btms\b|\bpc\b', l):
        return None
    if re.search(r'\bicmp\b|alchemy', l):
        return 'barco-sms'
    if re.search(r'doremi|dcp-?2000|dcp-?2k4|showvault|ims3000', l):
        return 'snmp-doremi'
    if re.search(r'server|cinecloud|qube|\bimb\b|imb-?s4', l):
        return 'snmp'
    if re.search(r'proiettore|barco|christie|nec|projector|dp2k|sp2k|dp4k|sp4k|cinemeccanica|dpc-|cmc4|cp2[0-9]{3}', l):
        return 'snmp'
    return None


# ── SNMP v1 GET (BER a mano, niente librerie) ─────────────────────────────────
def _ber_len(n):
    if n < 0x80:
        return bytes([n])
    b = n.to_bytes((n.bit_length() + 7) // 8, 'big')
    return bytes([0x80 | len(b)]) + b


def _tlv(tag, value):
    return bytes([tag]) + _ber_len(len(value)) + value


def _ber_int(n):
    return _tlv(0x02, n.to_bytes(max(1, (n.bit_length() + 8) // 8), 'big', signed=True))


def _ber_oid(oid):
    nums = [int(x) for x in oid.split('.')]
    out = bytes([40 * nums[0] + nums[1]])
    for n in nums[2:]:
        chunk = [n & 0x7f]
        n >>= 7
        while n:
            chunk.insert(0, 0x80 | (n & 0x7f))
            n >>= 7
        out += bytes(chunk)
    return _tlv(0x06, out)


def _ber_read(buf, i):
    """Restituisce (tag, valore, indice successivo)."""
    tag = buf[i]
    n = buf[i + 1]
    i += 2
    if n & 0x80:
        k = n & 0x7f
        n = int.from_bytes(buf[i:i + k], 'big')
        i += k
    return tag, buf[i:i + n], i + n


def snmp_get(ip, oid, community=COMMUNITY, timeout=TIMEOUT):
    request_id = int.from_bytes(os.urandom(3), 'big')
    varbind = _tlv(0x30, _ber_oid(oid) + b'\x05\x00')
    pdu = _tlv(0xa0, _ber_int(request_id) + _ber_int(0) + _ber_int(0) + _tlv(0x30, varbind))
    msg = _tlv(0x30, _ber_int(0) + _tlv(0x04, community.encode()) + pdu)
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.settimeout(timeout)
        s.sendto(msg, (ip, 161))
        data, _ = s.recvfrom(65535)
    # messaggio → [versione, community, GetResponse]
    _, body, _ = _ber_read(data, 0)
    i = 0
    _, _, i = _ber_read(body, i)          # versione
    _, _, i = _ber_read(body, i)          # community
    tag, pdu, _ = _ber_read(body, i)
    if tag != 0xa2:
        raise ValueError('risposta SNMP inattesa')
    j = 0
    _, _, j = _ber_read(pdu, j)           # request id
    _, err, j = _ber_read(pdu, j)         # error status
    _, _, j = _ber_read(pdu, j)           # error index
    if int.from_bytes(err, 'big'):
        raise ValueError(f'errore SNMP {int.from_bytes(err, "big")}')
    _, varbinds, _ = _ber_read(pdu, j)
    _, vb, _ = _ber_read(varbinds, 0)
    _, _, k = _ber_read(vb, 0)            # OID
    tag, value, _ = _ber_read(vb, k)
    if tag in (0x80, 0x81, 0x82):         # noSuchObject / noSuchInstance / endOfMibView
        raise ValueError('OID non supportato')
    if tag == 0x04:
        return value.decode('utf-8', 'replace').strip('\x00 \r\n')
    if tag in (0x02, 0x41, 0x42, 0x43):
        return str(int.from_bytes(value, 'big'))
    return value.hex()


# ── Barco ICMP: SOAP ──────────────────────────────────────────────────────────
# Come il client del TMS: Login, richieste e Logout passano sulla stessa
# connessione HTTPS tenuta aperta, perché la sessione Barco vive lì. Se il
# server manda anche un cookie, lo si rimanda.
class BarcoSMS:
    def __init__(self, ip):
        # L'ICMP ha un certificato autofirmato: la verifica si salta solo qui,
        # verso l'IP privato del cinema dentro la VPN.
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        self.conn = http.client.HTTPSConnection(ip, BARCO_SMS_PORT, timeout=TIMEOUT * 2, context=ctx)
        self.cookie = None

    def call(self, metodo, params=''):
        body = ('<?xml version="1.0" encoding="utf-8"?>'
                '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">'
                f'<soap:Body><ns0:{metodo} xmlns:ns0="{BARCO_SMS_NS}">{params}</ns0:{metodo}>'
                '</soap:Body></soap:Envelope>').encode()
        headers = {'Content-Type': f'application/soap+xml; charset=utf-8; action="{BARCO_SMS_NS}/{metodo}"',
                   'SOAPAction': f'{BARCO_SMS_NS}/{metodo}', 'Connection': 'keep-alive'}
        if self.cookie:
            headers['Cookie'] = self.cookie
        self.conn.request('POST', '/sms/sms_1', body, headers)
        r = self.conn.getresponse()
        data = r.read()
        if r.getheader('Set-Cookie'):
            self.cookie = r.getheader('Set-Cookie').split(';')[0]
        root = ElementTree.fromstring(data)
        valori = {el.tag.split('}')[-1]: (el.text or '').strip() for el in root.iter()}
        esito = valori.get(metodo + 'Result')
        if esito not in (None, '0'):
            raise ValueError(f'{metodo}: errore Barco {esito}')
        return valori

    def close(self):
        try:
            self.call('Logout')
        except Exception:
            pass
        self.conn.close()


def barco_sms(ip):
    user, pwd = os.environ.get('BARCO_USER'), os.environ.get('BARCO_PASSWORD')
    if not (user and pwd):
        raise ValueError('mancano BARCO_USER / BARCO_PASSWORD')
    sms = BarcoSMS(ip)
    try:
        sms.call('Login', f'<ns0:userName>{escape(user)}</ns0:userName>'
                          f'<ns0:password>{escape(pwd)}</ns0:password>')
        info = sms.call('GetProductInformation')
    finally:
        sms.close()
    if not info.get('Version'):
        raise ValueError('versione assente nella risposta')
    return {'sw': info['Version'], 'modello': info.get('ProductName', ''),
            'seriale': info.get('SerialNumber', '')}


# ── Lettura di un dispositivo ─────────────────────────────────────────────────
def leggi(dev):
    metodo = dev['metodo']
    try:
        if metodo == 'barco-sms':
            ris = barco_sms(dev['ip'])
        elif metodo == 'snmp-doremi':
            ris = {'sw': snmp_get(dev['ip'], OID_DOREMI_SW)}
            try:
                ris['fw'] = snmp_get(dev['ip'], OID_DOREMI_FW)
            except Exception:
                pass
        else:
            ris = {'sw': snmp_get(dev['ip'], OID_SYSDESCR)}
        ris = {k: v for k, v in ris.items() if v}
        ris['metodo'] = metodo
        return dev, ris, None
    except Exception as e:
        return dev, None, str(e) or e.__class__.__name__


def main():
    # Su Windows, con l'output rediretto, ✓ e ✗ non devono far fallire la stampa
    try:
        sys.stdout.reconfigure(errors='replace')
    except AttributeError:
        pass
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('--tutti', action='store_true', help='includi anche le reti locali 192.168.x')
    ap.add_argument('--solo', help='legge solo i dispositivi che contengono questo testo')
    args = ap.parse_args()

    dispositivi = []
    for d in leggi_dispositivi():
        d['metodo'] = metodo_per(d['label'])
        if not d['metodo']:
            continue
        if not args.tutti and d['net'] != 'vpn':
            continue
        if args.solo and args.solo.lower() not in ' '.join(
                (d['cinema'], d['citta'], d['ip'], d['label'])).lower():
            continue
        dispositivi.append(d)

    # Le letture precedenti restano: un dispositivo spento oggi non deve
    # cancellare la versione letta ieri.
    precedenti = {}
    if OUTPUT_PATH.exists():
        m = re.search(r'=\s*(\{.*\})\s*;?\s*$', OUTPUT_PATH.read_text(encoding='utf-8'), re.DOTALL)
        if m:
            precedenti = json.loads(m.group(1)).get('dispositivi', {})

    adesso = datetime.datetime.now().replace(microsecond=0).isoformat()
    print(f'Leggo {len(dispositivi)} dispositivi…')
    ok = 0
    with ThreadPoolExecutor(max_workers=16) as pool:
        for dev, ris, err in pool.map(leggi, dispositivi):
            nome = f"{dev['cinema']} ({dev['citta']}) — {dev['label']} {dev['ip']}"
            if ris:
                ok += 1
                ris['letto'] = adesso
                precedenti[dev['chiave']] = ris
                print(f"  ✓ {nome}: {ris['sw']}")
            else:
                print(f'  ✗ {nome}: {err}')

    out = {'aggiornato': adesso, 'dispositivi': dict(sorted(precedenti.items()))}
    OUTPUT_PATH.write_text(
        '// Generato da leggi_versioni.py — non modificare a mano.\n'
        'const SIGRA_VERSIONI = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n',
        encoding='utf-8')
    print(f'\n{ok}/{len(dispositivi)} letti. Scritto {OUTPUT_PATH.name}: ora va committato.')
    return 0 if ok or not dispositivi else 1


if __name__ == '__main__':
    sys.exit(main())
