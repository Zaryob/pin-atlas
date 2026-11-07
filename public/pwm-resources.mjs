/* SPDX-License-Identifier: GPL-3.0-or-later */
// RP2040/RP2350 mux names identify a shared counter (slice) and duty channel.
// Other vendors' PWM names need their own resource model.
export function pwmResource(fn, board) {
  if (!/^RP(?:2040|235[04][AB]?)$/.test(board.mcu) || fn?.group !== 'PWM') return null;
  const match = /^PWM(\d+) ([AB])$/.exec(fn.name);
  return match ? {slice:`PWM${match[1]}`,channel:match[2],id:`PWM${match[1]}:${match[2]}`} : null;
}

export function pwmNotes(assignments, board, t = k => k) {
  const slices = new Map(), channels = new Map();
  for (const [number, entry] of Object.entries(assignments)) {
    const pin = board.pins.find(p => String(p.number) === number);
    const resource = pwmResource(pin?.functions.find(f => f.name === entry.function), board);
    if (!resource) continue;
    if (!slices.has(resource.slice)) slices.set(resource.slice, new Set());
    slices.get(resource.slice).add(resource.channel);
    channels.set(resource.id, (channels.get(resource.id) || 0) + 1);
  }
  const notes = [];
  for (const [slice, channels] of slices) if (channels.size > 1) notes.push(t('pwmSharedFrequency', {slice}));
  for (const [channel, count] of channels) if (count > 1) notes.push(t('pwmFanoutNote', {channel}));
  return notes;
}
