/* SPDX-License-Identifier: GPL-3.0-or-later */
import {peripheralSignal} from './peripherals.mjs';
import {electricalKeys} from './hardware-config.mjs';
export const physicalLabel = pin => pin.physicalLabel || String(pin.number).padStart(2, '0');

export function options(pin) {
  return [{ name: pin.baseFunction || (pin.type === 'GPIO' ? 'GPIO' : pin.name), group: pin.type }, ...pin.functions];
}

export function planReference(profile, t = k => k) {
  const mcu = profile.id === 'raspberry-pi-40' ? t('commonReference') : profile.mcu;
  return mcu && !profile.name.includes(mcu) ? `${profile.name} · ${mcu}` : profile.name;
}

export function validatePlan(data, target, t, { allowDuplicateSignals = false, allowConflictingRemaps = false, allowSharedNets = false, allowRetiredFunctions = false, allowHardwareConflicts = false, ignoreLegacyHseAssignments = false } = {}) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(t('invalidPlan'));
  const clean = {}, nets = new Map(), signals = new Map(), remaps = new Map();
  for (const [key, value] of Object.entries(data)) {
    // Preserve valid saved entries from plans made before the LQFP-100 HSE correction.
    if (ignoreLegacyHseAssignments && target.id === 'stm32f103vbt6' &&
        ((key === '12' && value?.function === 'PD0') || (key === '13' && value?.function === 'PD1'))) continue;
    const pin = target.pins.find(pin => String(pin.number) === key);
    const retired=pin?.retiredFunctions?.includes(value?.function);
    if(pin?.inactiveFunctions?.includes(value?.function) && !options(pin).some(fn=>fn.name===value.function) && !allowHardwareConflicts)
      throw new Error(t('hwRouteConflict',{pin:physicalLabel(pin),name:value.function}));
    if(pin?.hardwareBlocked && !allowHardwareConflicts)throw new Error(t('hwPinUnavailable',{pin:physicalLabel(pin),controls:pin.hardwareBlocks.join(', ')}));
    if(retired && !allowRetiredFunctions)throw new Error(t('retiredFunction',{name:value.function,pin:physicalLabel(pin)}));
    if (!pin || pin.reserved || !value || typeof value !== 'object' ||
        !(options(pin).some(fn => fn.name === value.function) || (allowRetiredFunctions && retired) || (allowHardwareConflicts && pin.inactiveFunctions?.includes(value.function))) ||
        typeof value.label !== 'string' || value.label.length > 40) {
      throw new Error(t('invalidAssignment'));
    }
    if (!allowSharedNets && ['GPIO', 'ADC'].includes(pin.type)) {
      for(const net of electricalKeys(pin)){
       if (nets.has(net)) throw new Error(t('sharedSignal', { pin: physicalLabel(nets.get(net)) }));
       nets.set(net, pin);
      }
    }
    const name = value.function;
    const fn = pin.functions.find(fn=>fn.name===name);
    const identity = fn && peripheralSignal(fn);
    const signalKey = identity ? `${identity.id}:${identity.channel||identity.role}` : fn && ['SPI','I2C','UART','CAN'].includes(fn.group) &&
      /^(SPI\d*|I2C\d*|USART\d+|UART\d*|LPUART\d+|FDCAN\d+|CAN\d+)[ _]+/i.test(name)
      ? name.toUpperCase().replace(/\s*\(MATRIX\)$/,'').replace(/[ _]+/g,':') : null;
    if (!allowDuplicateSignals && signalKey) {
      if (signals.has(signalKey)) throw new Error(t('duplicateSignal', { name, pin: physicalLabel(signals.get(signalKey)) }));
      signals.set(signalKey, pin);
    }
    if (fn?.configuration) {
      const {field,values} = fn.configuration;
      const allowed = new Set(values.map(String));
      const common = remaps.has(field) ? new Set([...remaps.get(field)].filter(value=>allowed.has(value))) : allowed;
      if (!common.size && !allowConflictingRemaps) throw new Error(t('remapConflict',{field,pin:physicalLabel(pin)}));
      remaps.set(field,common);
    }
    clean[key] = { function: name, label: value.label };
  }
  return clean;
}

export function samePlan(first, second) {
  const entries = Object.entries(first);
  return entries.length === Object.keys(second).length &&
    entries.every(([pin, entry]) => entry?.function === second[pin]?.function && entry?.label === second[pin]?.label);
}
