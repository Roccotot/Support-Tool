#!/usr/bin/env python3
"""
Scarica in locale le immagini dei modelli (MODEL_IMG in index.html) nella
cartella img/ e aggiorna index.html per usare i percorsi relativi.

Da eseguire una volta da un PC con accesso a internet:

    python3 scarica_immagini.py

Poi committare la cartella img/ e index.html modificato. Lo script è
idempotente: le voci già convertite in img/... vengono saltate, quindi si
può rilanciare per riprovare solo i download falliti.
"""
import re
import sys
from pathlib import Path
from urllib.request import Request, urlopen

HTML_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent / 'index.html'
IMG_DIR   = HTML_PATH.parent / 'img'

EXT_BY_TYPE = {
    'image/jpeg':    '.jpg',
    'image/png':     '.png',
    'image/webp':    '.webp',
    'image/gif':     '.gif',
    'image/svg+xml': '.svg',
}


def sniff_ext(data):
    """Estensione dai magic bytes, se il Content-Type non è affidabile."""
    if data[:8] == b'\x89PNG\r\n\x1a\n':
        return '.png'
    if data[:2] == b'\xff\xd8':
        return '.jpg'
    if data[:4] == b'RIFF' and data[8:12] == b'WEBP':
        return '.webp'
    if data[:6] in (b'GIF87a', b'GIF89a'):
        return '.gif'
    return None


def download(url):
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120'})
    with urlopen(req, timeout=30) as resp:
        data  = resp.read()
        ctype = resp.headers.get_content_type()
    ext = sniff_ext(data) or EXT_BY_TYPE.get(ctype)
    if not ext:
        raise ValueError(f'contenuto non riconosciuto come immagine ({ctype})')
    return data, ext


def main():
    html = HTML_PATH.read_text(encoding='utf-8')
    m = re.search(r'const MODEL_IMG = \{(.*?)\n\};', html, re.DOTALL)
    if not m:
        sys.exit('Blocco MODEL_IMG non trovato in ' + str(HTML_PATH))

    entries = re.findall(r"(\w+):\s*'([^']+)'", m.group(1))
    if not entries:
        sys.exit('Nessuna voce trovata in MODEL_IMG')

    IMG_DIR.mkdir(exist_ok=True)
    ok, skipped, failed = 0, 0, 0

    for key, url in entries:
        if not url.startswith('http'):
            skipped += 1
            continue
        try:
            data, ext = download(url)
        except Exception as e:
            print(f'FALLITO  {key}: {e}')
            failed += 1
            continue
        local = f'img/{key}{ext}'
        (HTML_PATH.parent / local).write_bytes(data)
        html = html.replace(f"'{url}'", f"'{local}'")
        print(f'OK       {key} → {local}  ({len(data)//1024} KB)')
        ok += 1

    HTML_PATH.write_text(html, encoding='utf-8')
    print(f'\nScaricate: {ok}  ·  Già locali: {skipped}  ·  Fallite: {failed}')
    if ok:
        print('Ora committa la cartella img/ e index.html aggiornato.')
    if failed:
        print('Per le voci fallite gli URL remoti restano invariati: puoi '
              'rilanciare lo script o sostituirli a mano in MODEL_IMG.')


if __name__ == '__main__':
    main()
