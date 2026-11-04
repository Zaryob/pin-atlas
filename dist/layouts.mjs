/* SPDX-License-Identifier: GPL-3.0-or-later */
// A catalog entry represents one physical layout. Processor function references
// stay separate so a shared footprint never implies identical alternate functions.
export function buildLayouts(boards) {
  const byId = new Map(boards.map(board => [board.id, board]));
  const definitions = [
    {
      id: 'pico-family', nameKey: 'picoLayout', subtitleKey: 'picoLayoutSubtitle',
      compatibleKey: 'picoCompatible', scopeKey: 'picoLayoutScope',
      profileIds: ['pico', 'picow', 'pico2', 'pico2w'], defaultProfile: 'pico2w',
      references: [
        {key: 'rp2040Reference', profileIds: ['pico', 'picow']},
        {key: 'rp2350Reference', profileIds: ['pico2w', 'pico2']}
      ]
    },
    {
      id: 'raspberry-pi-40', nameKey: 'piLayout', subtitleKey: 'piLayoutSubtitle',
      compatibleKey: 'piCompatible', scopeKey: 'piLayoutScope',
      profileIds: ['raspberry-pi-40', 'raspberry-pi-4'], defaultProfile: 'raspberry-pi-40',
      references: [
        {key: 'commonReference', profileIds: ['raspberry-pi-40']},
        {key: 'bcm2711Reference', profileIds: ['raspberry-pi-4']}
      ]
    }
  ];
  const grouped = new Set(definitions.flatMap(layout => layout.profileIds));
  const layouts = definitions.map(definition => {
    const profiles = definition.profileIds.map(id => {
      if (!byId.has(id)) throw new Error(`Missing pin reference: ${id}`);
      return byId.get(id);
    });
    const physicalPins = profiles[0].pins.map(pin => [pin.number, pin.name, pin.type]);
    for (const profile of profiles) {
      const pins = profile.pins.map(pin => [pin.number, pin.name, pin.type]);
      if (profile.layout !== profiles[0].layout || JSON.stringify(pins) !== JSON.stringify(physicalPins)) {
        throw new Error(`Incompatible physical layout: ${profile.id}`);
      }
    }
    return {...byId.get(definition.defaultProfile), ...definition, profiles};
  });
  for (const board of boards.filter(board => !grouped.has(board.id))) {
    layouts.push({...board, profiles: [board], profileIds: [board.id], defaultProfile: board.id, references: []});
  }
  return layouts;
}

// Keep old shared links, exports and per-model browser plans addressable.
export function resolveProfile(layouts, id, preferredProfile) {
  const layout = layouts.find(item => item.id === id || item.profileIds.includes(id)) || layouts[0];
  const profileId = layout.profileIds.includes(preferredProfile) ? preferredProfile
    : id !== layout.id && layout.profileIds.includes(id) ? id : layout.defaultProfile;
  return {layout, profile: layout.profiles.find(profile => profile.id === profileId)};
}
