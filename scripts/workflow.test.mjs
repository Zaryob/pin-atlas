/* SPDX-License-Identifier: GPL-3.0-or-later */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildLayouts, resolveProfile } from '../public/layouts.mjs';
import { compatibleModels, filterCompatibleModels } from '../public/compatibility.mjs';
import { options, physicalLabel, planReference, samePlan, validatePlan } from '../public/plans.mjs';

const boards = JSON.parse(readFileSync(new URL('../public/data/boards.json', import.meta.url)));
const layouts = buildLayouts(boards);
const t = (key, params = {}) => `${key} ${JSON.stringify(params)}`;

test('full user workflow: find model -> pick pin -> add to plan -> simulate page refresh -> preserve local plan on incoming share', () => {
  // 1. Modeli bul: user searches catalog for "Pico W"
  const searchQuery = 'pico w';
  const matchingModels = layouts.flatMap(item => {
    const models = filterCompatibleModels(compatibleModels(item), searchQuery, model => `${model.name} ${model.id}`);
    return models.map(model => ({ layout: item, model }));
  });
  assert.equal(matchingModels.length, 1);
  const { layout, model } = matchingModels[0];
  assert.equal(model.name, 'Raspberry Pi Pico W');
  assert.equal(model.profileId, 'picow');

  // Resolve to correct processor reference profile (RP2040)
  const resolved = resolveProfile(layouts, layout.id, model.profileId);
  assert.equal(resolved.profile.id, 'picow');
  assert.equal(resolved.profile.mcu, 'RP2040');
  const board = resolved.profile;

  // 2. Pini seç: pick physical pin 1 (GP0)
  const pin1 = board.pins.find(p => p.number === 1);
  assert.ok(pin1);
  assert.equal(pin1.name, 'GP0');
  assert.equal(physicalLabel(pin1), '01');

  const availableOpts = options(pin1);
  assert.ok(availableOpts.some(fn => fn.name === 'I2C0 SDA'));

  // 3. Plana ekle: assign I2C0 SDA with label "sensör"
  const candidatePlan = {
    1: { function: 'I2C0 SDA', label: 'sensör' }
  };
  const validatedPlan = validatePlan(candidatePlan, board, t);
  assert.deepEqual(validatedPlan, candidatePlan);

  // Simulate storing in localStorage ('pin-atlas:plans:v1')
  const storage = {};
  const storageKey = 'pin-atlas:plans:v1';
  storage[storageKey] = JSON.stringify({ [board.id]: validatedPlan });

  // 4. Sayfayı yenile: re-read saved plans from storage
  const reloadedPlans = JSON.parse(storage[storageKey]);
  assert.ok(reloadedPlans[board.id]);
  const activePlan = validatePlan(reloadedPlans[board.id], board, t, { allowDuplicateSignals: true });
  assert.equal(activePlan[1].function, 'I2C0 SDA');
  assert.equal(activePlan[1].label, 'sensör');

  // 5. Aynı referansta kaydı gör
  assert.ok(samePlan(activePlan, candidatePlan));
  assert.equal(planReference(board, t), 'Raspberry Pi Pico W · RP2040');

  // 6. Paylaşım bağlantısını açınca mevcut kaydı koru
  // Incoming shared plan for the same board (Pico W) with different assignments
  const incomingRaw = {
    1: { function: 'UART0 TX', label: 'GPS' },
    2: { function: 'UART0 RX', label: 'GPS' }
  };
  const validatedIncoming = validatePlan(incomingRaw, board, t);

  // Check preview logic: existing saved plan differs from incoming
  const existingSaved = reloadedPlans[board.id];
  assert.ok(!samePlan(existingSaved, validatedIncoming));

  // In preview mode: before user clicks "Replace saved plan", storage MUST NOT be overwritten
  assert.deepEqual(JSON.parse(storage[storageKey])[board.id], candidatePlan);

  // Only when user confirms replacement, update storage
  storage[storageKey] = JSON.stringify({ ...reloadedPlans, [board.id]: validatedIncoming });
  assert.deepEqual(JSON.parse(storage[storageKey])[board.id], incomingRaw);
});

test('workbench plan formatting includes physical pin, name, and processor reference', () => {
  const picow = boards.find(b => b.id === 'picow');
  const pi4 = boards.find(b => b.id === 'raspberry-pi-4');
  assert.equal(planReference(picow, t), 'Raspberry Pi Pico W · RP2040');
  assert.equal(planReference(pi4, t), `${pi4.name} · ${pi4.mcu}`);

  const pin1 = picow.pins.find(p => p.number === 1);
  const formattedPhys = physicalLabel(pin1);
  assert.equal(formattedPhys, '01');
});

test('plan validation rejects duplicate bus signals across import, share and manual entry', () => {
  const picow = boards.find(b => b.id === 'picow');
  // Pin 1 (GP0) and Pin 6 (GP4) can both be I2C0 SDA
  const duplicate = {
    1: { function: 'I2C0 SDA', label: '' },
    6: { function: 'I2C0 SDA', label: '' }
  };
  assert.throws(() => validatePlan(duplicate, picow, t), /duplicateSignal/);
});

test('plan validation rejects reserved pins on Pi 4 and ESP32', () => {
  const pi4 = boards.find(b => b.id === 'raspberry-pi-4');
  // Physical pins 27 and 28 are reserved for HAT EEPROM
  assert.throws(() => validatePlan({ 27: { function: 'GPIO', label: 'test' } }, pi4, t), /invalidAssignment/);
  assert.throws(() => validatePlan({ 28: { function: 'GPIO', label: 'test' } }, pi4, t), /invalidAssignment/);

  const esp = boards.find(b => b.id === 'esp32-devkitc-v4');
  // Pin 16 is GPIO9 (internal flash)
  assert.throws(() => validatePlan({ 16: { function: 'GPIO', label: 'test' } }, esp, t), /invalidAssignment/);
});

test('LQFP-100 plans keep oscillator wiring and GPIO assignments separate', () => {
  const profile = boards.find(board => board.id === 'stm32f103vbt6');
  const valid = {
    40: { function: 'TIM1_CH1', label: 'PWM' },
    81: { function: 'GPIO', label: 'PD0' },
    82: { function: 'GPIO', label: 'PD1' }
  };
  const legacy = {
    ...valid,
    12: { function: 'PD0', label: 'old input' },
    13: { function: 'PD1', label: 'old output' }
  };
  assert.throws(() => validatePlan(legacy, profile, t), /invalidAssignment/);
  assert.deepEqual(validatePlan(legacy, profile, t, { ignoreLegacyHseAssignments: true }), valid);

  const oscillator = { 12: { function: 'OSC_IN', label: 'crystal' } };
  assert.deepEqual(validatePlan(oscillator, profile, t, { ignoreLegacyHseAssignments: true }), oscillator);
});
