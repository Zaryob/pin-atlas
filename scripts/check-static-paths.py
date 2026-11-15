"""Check deployable local references under a GitHub Pages project prefix."""
from html.parser import HTMLParser
import argparse
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

BASE = Path(__file__).resolve().parents[1]
site_root = BASE / '_site'
public_root = BASE / 'public'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--require-built', action='store_true', help='Fail if the Jekyll output has not been built')
args = parser.parse_args()
if args.require_built:
    assert (site_root / 'index.html').is_file(), 'Missing _site/index.html; build Jekyll before deployment checks'

# Verify static files exist in public
for css in public_root.rglob('*.css'):
    for match in re.finditer(r'url\([\"\']?([^\)\"\']+)', css.read_text()):
        value = match[1]
        if urlsplit(value).scheme or value.startswith('#'):
            continue
        assert (css.parent / value).exists(), f'Missing CSS asset: {css} -> {value}'

source = (public_root / 'app.js').read_text()
assert "fetch('/" not in source and 'fetch("/' not in source
assert "fetchDataJSON('catalog.json'" in source
assert (public_root/'data/catalog.json').is_file()

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
                if path_str.startswith('pin-atlas/'):
                    path_str = path_str.removeprefix('pin-atlas/')
                target = site_root / path_str
                assert target.exists(), f'Missing asset in _site: {value}'
    Check().feed(index_text)

    # Generated pinout pages link with relative paths; resolve them from each page's own folder.
    class PageCheck(HTMLParser):
        def __init__(self, page):
            super().__init__()
            self.page = page
        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            for attribute in ('src', 'href'):
                value = attrs.get(attribute, '')
                if not value or value.startswith(('#', 'data:')) or urlsplit(value).scheme:
                    continue
                path_str = unquote(urlsplit(value).path)
                if path_str.startswith('/'):
                    target = site_root / path_str.lstrip('/').removeprefix('pin-atlas/')
                else:
                    target = (self.page.parent / path_str).resolve()
                assert target.exists() and site_root.resolve() in [target, *target.parents], f'Missing target in {self.page}: {value}'
    pages = [*site_root.glob('boards/**/index.html'), *site_root.glob('tr/boards/**/index.html')]
    assert len(pages) >= 4, 'Missing generated pinout pages; run npm run build:data'
    for page in pages:
        text = page.read_text()
        assert not text.startswith('---'), f'Unprocessed Jekyll front matter: {page}'
        PageCheck(page).feed(text)

print('Static entry point, bundled fonts and module-relative data paths checked for /pin-atlas/.')
