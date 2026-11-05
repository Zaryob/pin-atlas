#!/usr/bin/env python3
"""Cold-check recorded source URLs without trusting or updating the local cache."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]

def audit(document):
    result = {'id':document['id'], 'status':'failed', 'attempts':[]}
    for url in document.get('downloadUrls', [document['url']]):
        try:
            request = urllib.request.Request(url, headers={'User-Agent':'Pin-Atlas-source-audit'})
            with urllib.request.urlopen(request, timeout=45) as response:
                digest = hashlib.sha256()
                while chunk := response.read(1024*1024):
                    digest.update(chunk)
            result['attempts'].append({'url':url, 'sha256':digest.hexdigest()})
            if digest.hexdigest() != document['sha256']:
                result['reason'] = 'Hash mismatch; source revision requires review'
                return result
            result['status'] = 'passed'
            return result
        except Exception as error:
            result['attempts'].append({'url':url, 'error':str(error)})
    result['reason'] = 'All recorded URLs unavailable'
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--document', action='append', default=[])
    parser.add_argument('--output', default='.cache/source-download-audit.json')
    args = parser.parse_args()
    docs = json.loads((ROOT/'sources/manifest.json').read_text())['documents']
    if args.document:
        assert set(args.document) <= {d['id'] for d in docs}, 'Unknown document ID'
        docs = [d for d in docs if d['id'] in args.document]
    with ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(audit,docs))
    path = ROOT/args.output
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(results,indent=2)+'\n')
    failed = [r['id'] for r in results if r['status']!='passed']
    print(f'Cold source audit: {len(results)-len(failed)}/{len(results)} passed. Report: {args.output}')
    if failed:
        raise SystemExit('Review source availability or revision: '+', '.join(failed))

if __name__ == '__main__':
    main()
