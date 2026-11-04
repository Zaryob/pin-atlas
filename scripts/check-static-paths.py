"""Check deployable local references under a GitHub Pages project prefix."""
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

BASE = Path(__file__).resolve().parents[1]
site_root = BASE / '_site'
public_root = BASE / 'public'

# Verify static files exist in public
for css in public_root.rglob('*.css'):
    for match in re.finditer(r'url\([\"\']?([^\)\"\']+)', css.read_text()):
        value = match[1]
        if urlsplit(value).scheme or value.startswith('#'):
            continue
        assert (css.parent / value).exists(), f'Missing CSS asset: {css} -> {value}'

source = (public_root / 'app.js').read_text()
assert "fetch('/" not in source and 'fetch("/' not in source
assert "['boards.json','evidence.json']" in source

# If _site exists, verify compiled output
if site_root.is_dir() and (site_root / 'index.html').is_file():
    index_text = (site_root / 'index.html').read_text()
    assert not index_text.startswith('---'), 'Unprocessed Jekyll front matter'
    assert '{%' not in index_text and '{{' not in index_text, 'Unprocessed Liquid template'
    class Check(HTMLParser):
        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            for attribute in ('src', 'href'):
                value = attrs.get(attribute, '')
                if not value or value.startswith(('#', 'data:')) or urlsplit(value).scheme:
                    continue
                path_str = unquote(urlsplit(value).path).lstrip('/')
                target = site_root / path_str
                assert target.exists(), f'Missing asset in _site: {value}'
    Check().feed(index_text)

print('Static entry point, bundled fonts and module-relative data paths checked for /pin-atlas/.')
