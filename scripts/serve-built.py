#!/usr/bin/env python3
"""Preview the Jekyll output under the GitHub Pages project path."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port', type=int, default=4185)
parser.add_argument('--base-path', default='/pin-atlas')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1] / '_site'
if not (root / 'index.html').is_file():
    parser.error('Build the site first: npm run build:ui')
prefix = '/' + args.base_path.strip('/') if args.base_path.strip('/') else ''


class Handler(SimpleHTTPRequestHandler):
    def log_request(self, code='-', size='-'):
        if isinstance(code, int) and code >= 400:
            super().log_request(code, size)

    def project_request(self, head=False):
        parts = urlsplit(self.path)
        if prefix and parts.path == prefix:
            self.send_response(302)
            self.send_header('Location', urlunsplit(('', '', prefix + '/', parts.query, '')))
            self.end_headers()
            return
        if prefix and not parts.path.startswith(prefix + '/'):
            self.send_error(404)
            return
        self.path = urlunsplit(('', '', parts.path[len(prefix):], parts.query, ''))
        if head:
            super().do_HEAD()
        else:
            super().do_GET()

    def do_GET(self):
        self.project_request()

    def do_HEAD(self):
        self.project_request(head=True)


class ThreadingServer(ThreadingHTTPServer):
    request_queue_size = 128


ThreadingServer(('127.0.0.1', args.port), partial(Handler, directory=str(root))).serve_forever()
