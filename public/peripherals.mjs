/* SPDX-License-Identifier: GPL-3.0-or-later */
import {electricalKeys} from './hardware-config.mjs';
import {pinAssignment,assignmentMessage} from './pin-assignments.mjs';
const roles = { SPI: ['SCK', 'MISO', 'MOSI'], I2C: ['SCL', 'SDA'], UART: ['TX', 'RX'], CAN: ['TX', 'RX'] };

// Read only signals already verified for this profile. Matrix routes remain
// capabilities; no default pinmux or bus number is invented for Arduino aliases.
export function peripheralSignal(fn) {
  if (!roles[fn.group]) return null;
  const name = fn.name.toUpperCase();
  let match = name.match(/^(SPI\d*|I2C\d*|USART\d+|LPUART\d+|UART\d*)[ _]+(.+)$/);
  if (!match) {
    const uart = name.match(/^U(\d+)(TX|RX)D$/);
    if (uart) match = [name, 'UART'+uart[1], uart[2]];
  }
  if (!match && fn.group === 'CAN') {
    const can = name.match(/^(?:FD)?CAN(\d*)[ _]+(TX|RX)|^(?:FD)?CAN(\d*)(TX|RX)|^CAN_(TX|RX)|^DCAN(\d*)[ _]+(TX|RX)/i);
    if (can) {
      const num = can[1] || can[3] || can[6] || '';
      const prefix = name.startsWith('FDCAN') ? 'FDCAN' : 'CAN';
      const bus = prefix + (num || '1');
      const role = (can[2] || can[4] || can[5] || can[7]).toUpperCase();
      match = [name, bus, role];
    }
  }
  if (!match) return null;
  let role = match[2].split(/[ _(]/)[0];
  if (fn.group === 'UART') role = ({TXD:'TX',RXD:'RX'})[role] || role;
  if (fn.group === 'SPI') role = ({RX:'MISO', TX:'MOSI', CIPO:'MISO', COPI:'MOSI', SCLK:'SCK', CLK:'SCK'})[role] || role;
  const channel=fn.group==='SPI' && /^(?:(?:NSS|SS|CS|CE)\d*|CSN)$/.test(role)?role:null;
  if(channel)role='CS';
  if (!roles[fn.group].includes(role) && !channel) return null;
  return {id:match[1], group:fn.group, role, ...(channel?{channel}:{})};
}

export function availablePeripherals(board,{includeSPIChipSelect=false}={}) {
  const buses = new Map();
  for (const pin of board.pins) {
    if (pin.reserved || pin.hardwareBlocked) continue;
    for (const fn of pin.functions) {
      const signal = peripheralSignal(fn);
      if (!signal) continue;
      if (!buses.has(signal.id)) buses.set(signal.id, {...signal, roles:signal.group==='SPI'&&includeSPIChipSelect?[...roles.SPI,'CS']:roles[signal.group], candidates:[],contacts:board.pins});
      buses.get(signal.id).candidates.push({pin, fn, role:signal.role, key:JSON.stringify([pin.number,fn.name])});
    }
  }
  return [...buses.values()].filter(bus=>bus.roles.every(role=>bus.candidates.some(c=>c.role===role)))
    .sort((a,b)=>a.id.localeCompare(b.id, undefined, {numeric:true}));
}

export function assemblePeripheral(bus, selections, assignments, t=k=>k) {
  const next = {...assignments}, used = new Set();
  for (const role of bus.roles) {
    const candidate = bus.candidates.find(c=>c.role===role && c.key===selections[role]);
    if (!candidate || candidate.pin.reserved) throw new Error(t('peripheralChoosePins'));
    const {pin,fn} = candidate, keys=[...electricalKeys(pin),...(pin.net?['net:'+pin.net]:[])];
    const occupied=pinAssignment(pin,assignments,{pins:bus.contacts},{otherContactOnly:true});
    if(occupied)throw new Error(assignmentMessage(occupied,t));
    if (keys.some(key=>used.has(key))) throw new Error(t('peripheralPinConflict'));
    keys.forEach(key=>used.add(key));
    if (assignments[pin.number] && assignments[pin.number].function!==fn.name) throw new Error(t('peripheralOccupied'));
    next[pin.number] = {function:fn.name, label:assignments[pin.number]?.label || ''};
  }
  return next;
}
