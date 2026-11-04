/* SPDX-License-Identifier: GPL-3.0-or-later */
export const physicalLabel = pin => pin.physicalLabel || String(pin.number).padStart(2, '0');

export function options(pin) {
  return [{ name: pin.baseFunction || (pin.type === 'GPIO' ? 'GPIO' : pin.name), group: pin.type }, ...pin.functions];
}

export function planReference(profile, t = k => k) {
  const mcu = profile.id === 'raspberry-pi-40' ? t('commonReference') : profile.mcu;
  return mcu && !profile.name.includes(mcu) ? `${profile.name} · ${mcu}` : profile.name;
}

export function validatePlan(data, target, t, { allowDuplicateSignals = false } = {}) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(t('invalidPlan'));
  const clean = {}, nets = new Map(), signals = new Map();
  for (const [key, value] of Object.entries(data)) {
    const pin = target.pins.find(pin => String(pin.number) === key);
    if (!pin || pin.reserved || !value || typeof value !== 'object' ||
        !options(pin).some(fn => fn.name === value.function) ||
        typeof value.label !== 'string' || value.label.length > 40) {
      throw new Error(t('invalidAssignment'));
    }
    if (pin.net && ['GPIO', 'ADC'].includes(pin.type)) {
      if (nets.has(pin.net)) throw new Error(t('sharedSignal', { pin: physicalLabel(nets.get(pin.net)) }));
      nets.set(pin.net, pin);
    }
    const name = value.function;
    if (!allowDuplicateSignals && /^(SPI|I2C|UART)\d/.test(name)) {
      if (signals.has(name)) throw new Error(t('duplicateSignal', { name, pin: physicalLabel(signals.get(name)) }));
      signals.set(name, pin);
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
