"""Check deployable local references under a GitHub Pages project prefix."""
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
root = Path(__file__).resolve().parents[1] / 'dist'
class Check(HTMLParser):
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        for attribute in ('src','href'):
            value=attrs.get(attribute,'')
            if not value or value.startswith(('#','data:')) or urlsplit(value).scheme: continue
            assert not value.startswith('/'), f'Root-relative HTML path: {value}'
            path=root/unquote(urlsplit(value).path)
            assert path.exists(), f'Missing asset: {value}'
Check().feed((root/'index.html').read_text())
for css in root.rglob('*.css'):
    for match in re.finditer(r'url\([\"\']?([^\)\"\']+)',css.read_text()):
        value=match[1]
        if urlsplit(value).scheme or value.startswith('#'): continue
        assert (css.parent/value).exists(), f'Missing CSS asset: {css} -> {value}'
source=(root/'app.js').read_text()
assert "fetch('/" not in source and 'fetch("/' not in source
assert "['boards.json','evidence.json']" in source
print('Static entry point, bundled fonts and module-relative data paths checked for /pin-atlas/.')
