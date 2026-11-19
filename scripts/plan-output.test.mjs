import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planReport,reportHTML,reportSVG,exportKiCadNetlist,exportZephyrDts} from '../public/plan-output.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const evidence=JSON.parse(readFileSync(new URL('../public/data/evidence.json',import.meta.url)));
test('portable reports retain exact physical labels, AF selectors, source locators and escaped Unicode labels',()=>{
 const board=boards.find(b=>b.id==='stm32f405rgt6');
 const report=planReport(board,{42:{function:'USART1_TX',label:'sensör <&> "TX"'}},evidence);
 assert.equal(report.rows[0].physical,'42');assert.equal(report.rows[0].selector,'AF7');
 assert(report.sources.some(source=>source.id==='f405rg-modes'));
 const html=reportHTML(report),svg=reportSVG(report,{width:100,height:100,viewBox:'0 0 100 100',content:'<rect width="100" height="100"/>'});
 for(const output of [html,svg]){
  assert(output.includes('sensör &lt;&amp;&gt; &quot;TX&quot;'));
  assert(output.includes('STM32F405RGT6'));assert(output.includes('github.com/STMicroelectronics'));
 }
});
test('exports carry warnings for preserved legacy remap conflicts',()=>{
 const board=boards.find(b=>b.id==='stm32f103c8t6');
 const report=planReport(board,{30:{function:'USART1_TX',label:''},43:{function:'USART1_RX',label:''}},evidence);
 assert.equal(report.warning,'remapConflict');assert(reportHTML(report).includes('remapConflict'));
});
test('KiCad netlist export generates structured S-expressions with sanitized nets',()=>{
 const board=boards.find(b=>b.id==='stm32f405rgt6');
 const netlist=exportKiCadNetlist(board,{42:{function:'USART1_TX',label:'Sensor TX'}},k=>k);
 assert(netlist.includes('(export (version "E")'));
 assert(netlist.includes('(tool "Pin Atlas v1.0.0")'));
 assert(netlist.includes('(node (ref "U1") (pin "42") (pinfunction "PA9") (pintype "bidirectional"))'));
 assert(netlist.includes('(name "Sensor_TX")'));
});
test('Zephyr Device Tree export configures enabled peripheral nodes and GPIO aliases',()=>{
 const board=boards.find(b=>b.id==='stm32f405rgt6');
 const dts=exportZephyrDts(board,{42:{function:'USART1_TX',label:'Debug TX'}},k=>k);
 assert(dts.includes('Target: Zephyr RTOS app.overlay'));
 assert(dts.includes('&usart1 {'));
 assert(dts.includes('status = "okay";'));
 assert(dts.includes('PA9 (pin 42)'));
});
