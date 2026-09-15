#!/usr/bin/env python3
"""
Genera dispositivi_mancanti.xlsx leggendo i blocchi dati da dati.js
(nella stessa cartella di questo script) — la stessa sorgente usata dal
sito, così l'Excel generato da riga di comando e quello scaricato dall'app
contengono le stesse righe.
"""

import re
from pathlib import Path

import openpyxl
from openpyxl.styles import PatternFill, Font, Alignment
from openpyxl.utils import get_column_letter

BASE_DIR    = Path(__file__).resolve().parent
DATA_PATH   = BASE_DIR / 'dati.js'
OUTPUT_PATH = BASE_DIR / 'dispositivi_mancanti.xlsx'

# ── Leggi dati.js ─────────────────────────────────────────────────────────────
with open(DATA_PATH, 'r', encoding='utf-8') as f:
    source = f.read()

# ── Estrai i blocchi di SIGRA_RAW ────────────────────────────────────────────
def extract_block(text, key):
    """Estrae il template literal `key: \`...\`,` dentro SIGRA_RAW"""
    m = re.search(r'\b' + re.escape(key) + r':\s*`(.*?)`\s*,', text, re.DOTALL)
    if not m:
        raise ValueError(f"Blocco {key} non trovato in dati.js")
    return m.group(1)

raw_vpn    = extract_block(source, 'vpn')
raw_novpn  = extract_block(source, 'offline')
raw_estivi = extract_block(source, 'estivi')

# ── Parser righe ─────────────────────────────────────────────────────────────
# Formato atteso (separatore: TAB reale o \t letterale):
#   NomeCinema - Città - NomeSala - NomeDispositivo[TAB]IP:porta[TAB]PROTOCOLLO
# Righe Coord / GEO → ignora; righe commento // → ignora; righe vuote → ignora

SKIP_KEYWORDS = ('Coord', 'GEO')

def parse_block(block, tipo):
    """
    Restituisce lista di dict con chiavi:
      cinema, citta, sala, dispositivo, ip, tipo
    """
    rows = []
    for raw_line in block.splitlines():
        line = raw_line.replace('\\t', '\t')
        line = line.strip()
        if not line:
            continue
        if line.startswith('//'):
            continue
        # Controlla se è una riga Coord/GEO (il terzo token dopo split su \t è GEO,
        # oppure la riga contiene letteralmente 'Coord' e termina con 'GEO')
        if 'Coord' in line and 'GEO' in line:
            continue
        # Split su TAB; accetta anche spazi multipli come separatori solo se non c'è tab
        parts = line.split('\t')
        if len(parts) < 2:
            # prova split su 2+ spazi
            parts = re.split(r'  +', line)
        if len(parts) < 2:
            continue

        left  = parts[0].strip()
        ip_porta = parts[1].strip() if len(parts) > 1 else ''
        # protocollo = parts[2] se esiste (non usato per Excel)

        # left = "Cinema - Città - Sala - Dispositivo"
        # Split su " - " (con spazi) — massimo 4 parti
        tokens = [t.strip() for t in left.split(' - ')]
        if len(tokens) < 4:
            # Potrebbe essere rete (es. "... - Rete - MikroTik") → ignoriamo
            # oppure una riga incompleta → ignoriamo
            continue

        cinema     = tokens[0]
        # Come fa il sito: "Chiusi -SI" → "Chiusi" (la sigla provincia non
        # fa parte del nome della città)
        citta      = re.sub(r'\s*-\s*[A-Z]{2}$', '', tokens[1]).strip()
        sala       = tokens[2]
        dispositivo = ' - '.join(tokens[3:])  # nel caso ci siano ulteriori " - "

        # Rimuovi la porta dall'IP
        ip = ip_porta.split(':')[0] if ':' in ip_porta else ip_porta

        rows.append({
            'cinema':      cinema,
            'citta':       citta,
            'sala':        sala,
            'dispositivo': dispositivo,
            'ip':          ip,
            'tipo':        tipo,
        })
    return rows

rows_vpn    = parse_block(raw_vpn,    'VPN')
rows_novpn  = parse_block(raw_novpn,  'Offline')
rows_estivi = parse_block(raw_estivi, 'Estivo')
all_rows    = rows_vpn + rows_novpn + rows_estivi

print(f"Righe VPN:    {len(rows_vpn)}")
print(f"Righe Offline:{len(rows_novpn)}")
print(f"Righe Estivi: {len(rows_estivi)}")
print(f"Totale dati:  {len(all_rows)}")

# ── Crea Excel ────────────────────────────────────────────────────────────────
wb = openpyxl.Workbook()
ws = wb.active
ws.title = 'Dispositivi'

# Colonne e larghezze
columns = [
    ('Cinema',      32),
    ('Città',       22),
    ('Rete',        10),
    ('Sala',        16),
    ('Dispositivo', 32),
    ('IP',          22),
]
for col_idx, (header, width) in enumerate(columns, start=1):
    ws.column_dimensions[get_column_letter(col_idx)].width = width

# ── Intestazione (riga 1) ─────────────────────────────────────────────────────
header_fill = PatternFill(fill_type='solid', fgColor='1F3864')
header_font = Font(color='FFFFFF', bold=True)

for col_idx, (header, _) in enumerate(columns, start=1):
    cell = ws.cell(row=1, column=col_idx, value=header)
    cell.fill  = header_fill
    cell.font  = header_font
    cell.alignment = Alignment(horizontal='center', vertical='center')

# ── Colori righe dati ─────────────────────────────────────────────────────────
FILL_PROIETTORE = PatternFill(fill_type='solid', fgColor='FFB3B3')
FILL_SERVER     = PatternFill(fill_type='solid', fgColor='FFFF99')
FILL_AUDIO      = PatternFill(fill_type='solid', fgColor='FFD580')

# Stesse categorie usate dal sito (devType in index.html)
RE_SERVER = re.compile(r'server|ims3000|dcp2000|dcp-2k4|cinecloud|doremi|qube|showvault|alchemy|\bicmp\b|\bimb\b', re.I)
RE_PROJ   = re.compile(r'proiettore|barco|christie|\bnec\b|projector|dp2k|sp2k|dp4k|sp4k|cinemeccanica|dpc-', re.I)
RE_AUDIO  = re.compile(r'processore audio|mixer|dolby|jbl|cp[0-9]|cpi[0-9]', re.I)


def get_fill(dispositivo):
    if re.search(r'mikrotik|router|\btms\b', dispositivo, re.I):
        return None
    if RE_SERVER.search(dispositivo):
        return FILL_SERVER
    if RE_PROJ.search(dispositivo):
        return FILL_PROIETTORE
    if RE_AUDIO.search(dispositivo):
        return FILL_AUDIO
    return None

# ── Scrivi righe ──────────────────────────────────────────────────────────────
for row_idx, row in enumerate(all_rows, start=2):
    values = [
        row['cinema'],
        row['citta'],
        row['tipo'],
        row['sala'],
        row['dispositivo'],
        row['ip'],
    ]
    fill = get_fill(row['dispositivo'])
    for col_idx, value in enumerate(values, start=1):
        cell = ws.cell(row=row_idx, column=col_idx, value=value)
        if fill:
            cell.fill = fill

# ── Salva ─────────────────────────────────────────────────────────────────────
wb.save(OUTPUT_PATH)
print(f"\nSalvato: {OUTPUT_PATH}")
print(f"Righe scritte (dati): {len(all_rows)}  (+ 1 intestazione = {len(all_rows)+1} totali)")
