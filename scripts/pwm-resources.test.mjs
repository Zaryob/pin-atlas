/* SPDX-License-Identifier: GPL-3.0-or-later */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const evidence=JSON.parse(readFileSync(new URL('../public/data/evidence.json',import.meta.url)));


import {validatePlan,samePlan} from '../public/plans.mjs';
import {planPayload,exportPlanPayload,decodePlanPayload} from '../public/plan-records.mjs';
import {planReport,reportHTML,reportSVG} from '../public/plan-output.mjs';

test('PWM sharing consent survives storage/share and v3 export, with warnings in printable reports',()=>{
 const b=boards.find(b=>b.id==='pico');
 const pins={1:{function:'PWM0 A',label:'fan-out',sharedPWM:true},21:{function:'PWM0 A',label:'same signal',sharedPWM:true}};
 for(const payload of [planPayload(b,pins),exportPlanPayload(b,pins,{},evidence)]){
  assert.deepEqual(decodePlanPayload(payload,b).pins,pins);
  assert(samePlan(pins,decodePlanPayload(payload,b).pins));
 }
 const exported=exportPlanPayload(b,pins,{},evidence);exported.pins[0].sharedPWM='true';
 assert.throws(()=>decodePlanPayload(exported,b),/invalidAssignment/);
 const report=planReport(b,pins,evidence);
 assert.match(report.warning,/pwmFanoutNote/);
 assert.match(reportHTML(report),/pwmFanoutNote/);
 assert.match(reportSVG(report,{width:400,height:600,viewBox:'0 0 400 600',content:''}),/pwmFanoutNote/);
 const different={1:{function:'PWM0 A',label:''},2:{function:'PWM0 B',label:''}};
 assert.match(planReport(b,different,evidence).warning,/pwmSharedFrequency/);
});
