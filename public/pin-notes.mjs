/* SPDX-License-Identifier: GPL-3.0-or-later */
// These describe general electrical/firmware usage, not separate board hazards.
const generalKeys=new Set(['stm32CubeGpio','stm32GpioNote','avrGpioNote','espGpioNote',
 'arduinoGpioNote','arduino32u4GpioNote','arduinoR4GpioNote','arduinoBleGpioNote',
 'arduinoNanoEsp32GpioNote','teensyGpioNote','bbbGpioNote']);

export function pinNotes(pin) {
 const specific=[],general=[];
 const add=(list,key,text)=>{if(key||text)list.push({key,text});};
 add(specific,pin.boardCircuitKey);
 add(specific,pin.analogCautionKey);
 if(pin.strapping)add(specific,'espStrappingNote');
 if(pin.noteKey)add(generalKeys.has(pin.noteKey)?general:specific,pin.noteKey);
 else if(pin.note)add(specific,null,pin.note);
 return {specific:unique(specific),general:unique(general)};
}
function unique(notes){return [...new Map(notes.map(note=>[note.key||note.text,note])).values()];}

// One physical warning can concern several contacts. Count it once, keep all labels.
export function circuitNotes(pins) {
 const notes=new Map();
 for(const pin of pins)for(const note of pinNotes(pin).specific) {
  const id=note.key||note.text;
  if(!notes.has(id))notes.set(id,{...note,pins:[]});
  if(!notes.get(id).pins.some(item=>item.number===pin.number))notes.get(id).pins.push(pin);
 }
 return [...notes.values()];
}
