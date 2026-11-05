import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
test('catalog contracts reject incomplete profiles and wrong MCU pads',()=>{
 const script=`import copy,json,sys
sys.path.insert(0,'scripts')
from catalog_contract import validate_catalog
b=json.load(open('public/data/boards.json')); d=json.load(open('sources/manifest.json'))['documents']
validate_catalog(b,d)
for kind in ('missing-field','wrong-pad','duplicate-source'):
 bad=copy.deepcopy(b); docs=copy.deepcopy(d)
 if kind=='missing-field': del bad[0]['voltage']
 elif kind=='duplicate-source': docs.append(docs[0])
 else:
  board=next(x for x in bad if x['id']=='nucleo-f446re')
  next(p for p in board['pins'] if p['type']=='GPIO')['mcuPin']=999
 try: validate_catalog(bad,docs)
 except AssertionError: pass
 else: raise RuntimeError('Accepted '+kind)
`;
 const result=spawnSync('python3',['-c',script],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
});
