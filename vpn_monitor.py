#!/usr/bin/env python3
"""
VPN Monitor — proxy locale per Support Tool Sigra Film
Interroga il MikroTik WireGuard e espone il conteggio su localhost.

Avvio:  python vpn_monitor.py
Poi apri il Support Tool normalmente (github.io o file locale).
"""

import json, re, time, base64, urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Thread

# ── CONFIGURAZIONE ────────────────────────────────────────────
MIKROTIK_IP   = '172.31.1.1'   # gateway VPN (subnet 172.31.1.0/24)
MIKROTIK_USER = 'admin'
MIKROTIK_PASS = ''              # ← inserire password MikroTik
ACTIVE_SEC    = 180             # handshake < 3 min = peer connesso
LISTEN_PORT   = 5005            # porta localhost esposta al browser
REFRESH_SEC   = 30              # secondi tra un aggiornamento e l'altro
# ─────────────────────────────────────────────────────────────

_cache = {'count': -1, 'error': 'avvio...'}

def parse_mt_time(t):
    """Converte '1h30m20s' / 'never' → secondi totali."""
    if not t or t == 'never':
        return float('inf')
    s = 0
    h  = re.search(r'(\d+)h',    t);  s += int(h.group(1))  * 3600 if h  else 0
    m  = re.search(r'(\d+)m(?!s)', t); s += int(m.group(1))  * 60   if m  else 0
    sc = re.search(r'(\d+)s',    t);  s += int(sc.group(1))         if sc else 0
    return s

def fetch_peers():
    url   = f'http://{MIKROTIK_IP}/rest/interface/wireguard/peers'
    creds = base64.b64encode(f'{MIKROTIK_USER}:{MIKROTIK_PASS}'.encode()).decode()
    req   = urllib.request.Request(url, headers={'Authorization': f'Basic {creds}'})
    with urllib.request.urlopen(req, timeout=5) as r:
        peers = json.loads(r.read())
    return sum(1 for p in peers
               if parse_mt_time(p.get('last-handshake', 'never')) < ACTIVE_SEC)

def updater():
    while True:
        try:
            _cache['count'] = fetch_peers()
            _cache['error'] = None
            print(f'[VPN] {_cache["count"]} utenti connessi')
        except Exception as e:
            _cache['count'] = -1
            _cache['error'] = str(e)
            print(f'[VPN] errore: {e}')
        time.sleep(REFRESH_SEC)

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != '/vpn':
            self.send_response(404); self.end_headers(); return
        body = json.dumps(_cache).encode()
        self.send_response(200)
        self.send_header('Content-Type',  'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_):
        pass  # silenzia log HTTP

if __name__ == '__main__':
    Thread(target=updater, daemon=True).start()
    print(f'VPN Monitor avviato → http://localhost:{LISTEN_PORT}/vpn')
    print(f'MikroTik: {MIKROTIK_IP}  |  refresh ogni {REFRESH_SEC}s')
    print('Ctrl+C per fermare\n')
    try:
        HTTPServer(('localhost', LISTEN_PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print('\nFermo.')
