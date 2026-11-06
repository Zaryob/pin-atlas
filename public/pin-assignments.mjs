/* SPDX-License-Identifier: GPL-3.0-or-later */
import {electricalKeys} from './hardware-config.mjs';

// Resolve occupancy against the saved plan, not the ordering of a merged object.
export function pinAssignment(pin,assignments,board,{otherContactOnly=false}={}) {
 if(!['GPIO','ADC'].includes(pin.type))return null;
 const keys=electricalKeys(pin);
 for(const [number,assignment] of Object.entries(assignments)) {
  if(otherContactOnly && number===String(pin.number))continue;
  const contact=board.pins.find(item=>String(item.number)===number);
  if(contact && ['GPIO','ADC'].includes(contact.type) && electricalKeys(contact).some(key=>keys.includes(key)))return {pin:contact,assignment};
 }
 return null;
}

export function assignmentMessage(occupied,t=k=>k) {
 const {pin,assignment}=occupied;
 return t('pinOccupied',{signal:pin.net||pin.name,pin:pin.physicalLabel||String(pin.number),function:assignment.function});
}
