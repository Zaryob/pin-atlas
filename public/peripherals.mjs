/* SPDX-License-Identifier: GPL-3.0-or-later */
const roles = { SPI: ['SCK', 'MISO', 'MOSI'], I2C: ['SCL', 'SDA'], UART: ['TX', 'RX'] };

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
  if (!match) return null;
  let role = match[2].split(/[ _(]/)[0];
  if (fn.group === 'SPI') role = ({RX:'MISO', TX:'MOSI', CIPO:'MISO', COPI:'MOSI', SCLK:'SCK', CLK:'SCK'})[role] || role;
  if (!roles[fn.group].includes(role)) return null;
  return {id:match[1], group:fn.group, role};
}

export function availablePeripherals(board) {
  const buses = new Map();
  for (const pin of board.pins) {
    if (pin.reserved) continue;
    for (const fn of pin.functions) {
      const signal = peripheralSignal(fn);
      if (!signal) continue;
      if (!buses.has(signal.id)) buses.set(signal.id, {...signal, roles:roles[signal.group], candidates:[]});
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
    const {pin,fn} = candidate, net=pin.net || String(pin.number);
    if (used.has(net)) throw new Error(t('peripheralPinConflict'));
    used.add(net);
    if (assignments[pin.number] && assignments[pin.number].function!==fn.name) throw new Error(t('peripheralOccupied'));
    next[pin.number] = {function:fn.name, label:assignments[pin.number]?.label || ''};
  }
  return next;
}
