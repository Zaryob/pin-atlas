#!/usr/bin/env python3
"""Compare or deliberately refresh ST table snapshots from hash-checked PDFs."""
import argparse,hashlib,json,sys
from pathlib import Path
import pdfplumber

ROOT=Path(__file__).resolve().parents[1]
PAGES={'stm32f103':range(28,34),'stm32-rm0008':range(175,182),
       'nucleo-um1724-r14':sorted({26,27,30,32,*range(37,63)}),
       'nucleo-um1956-r6':[12,13,21,22,24,30,31,32],
       'nucleo-um1974-r11':[14,15,31,32,33,34,35,37,61,62,63,64,65,70,71],
       'nucleo-um2407-r6':[15,16,31,32,33,34,38,39,40,41,42,43,44]}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write',action='store_true',help='Refresh the table snapshots and their manifest hashes after source review')
    args=parser.parse_args()
    manifest_path=ROOT/'sources/manifest.json'
    manifest=json.loads(manifest_path.read_text())
    for doc in manifest['documents']:
        if doc['id'] not in PAGES:continue
        pdf_path=ROOT/'.cache/primary-sources'/doc['file']
        if hashlib.sha256(pdf_path.read_bytes()).hexdigest()!=doc['sha256']:
            sys.exit(f"Source hash mismatch: {doc['id']}")
        snapshot={'schema':1,'document':doc['id'],'sourceSha256':doc['sha256'],'pages':{}}
        with pdfplumber.open(pdf_path) as pdf:
            for number in PAGES[doc['id']]:
                page=pdf.pages[number-1]
                snapshot['pages'][str(number)]={'tables':page.extract_tables(),'tokens':[token for token in ['PD01_REMAP'] if token in (page.extract_text() or '')]}
        raw=(json.dumps(snapshot,ensure_ascii=False,indent=2)+'\n').encode('utf-8')
        spec=doc['tableSnapshot'];path=ROOT/spec['file']
        digest=hashlib.sha256(raw).hexdigest()
        if args.write:
            path.write_bytes(raw);spec['sha256']=digest
        elif path.read_bytes()!=raw or spec['sha256']!=digest:
            sys.exit(f"ST table snapshot differs from original PDF: {doc['id']}")
    if args.write:manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(f'ST table snapshots match {len(PAGES)} hash-locked original PDFs.' if not args.write else 'ST table snapshots refreshed; review the diff and regenerate verification outputs.')

if __name__=='__main__':main()
