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
      profileIds: ['raspberry-pi-40', 'raspberry-pi-4', 'raspberry-pi-5'], defaultProfile: 'raspberry-pi-40',
      references: [
        {key: 'commonReference', profileIds: ['raspberry-pi-40']},
        {key: 'bcm2711Reference', profileIds: ['raspberry-pi-4']},
        {key: 'rp1Reference', profileIds: ['raspberry-pi-5']}
      ]
    },
    {
      id: 'arduino-uno', nameKey: 'unoLayout', subtitleKey: 'unoLayoutSubtitle',
      compatibleKey: 'unoCompatible',
      profileIds: ['arduino-uno-r3', 'arduino-leonardo', 'arduino-uno-r4-minima', 'arduino-uno-r4-wifi'], defaultProfile: 'arduino-uno-r3',
      geometryConnectors: ['PWR', 'ANALOG', 'DIGITAL'], sharedContactCount: 32,
      references: [
        {key: 'unoR3Reference', profileIds: ['arduino-uno-r3']},
        {key: 'leonardoReference', profileIds: ['arduino-leonardo']},
        {key: 'unoR4MinimaReference', profileIds: ['arduino-uno-r4-minima']},
        {key: 'unoR4WifiReference', profileIds: ['arduino-uno-r4-wifi']}
      ]
    },
    {
      id: 'arduino-nano', nameKey: 'nanoLayout', subtitleKey: 'nanoLayoutSubtitle',
      compatibleKey: 'nanoCompatible',
      profileIds: ['arduino-nano-classic', 'arduino-nano-every'], defaultProfile: 'arduino-nano-classic',
      geometryConnectors: ['L', 'R'], sharedContactCount: 30,
      references: [
        {key: 'nanoClassicReference', profileIds: ['arduino-nano-classic']},
        {key: 'nanoEveryReference', profileIds: ['arduino-nano-every']}
      ]
    },
    {
      id: 'esp32-devkitc-v4', nameKey: 'esp32DevkitLayout', subtitleKey: 'esp32DevkitSubtitle',
      compatibleKey: 'esp32-devkitc-v4Compatible', sharedContactCount: 38,
      profileIds: ['esp32-devkitc-v4','esp32-devkitc-v4-wrover'], defaultProfile: 'esp32-devkitc-v4',
      references: [
        {key:'esp32WroomReference',profileIds:['esp32-devkitc-v4']},
        {key:'esp32WroverReference',profileIds:['esp32-devkitc-v4-wrover']}
      ]
    },
    {
      id: 'esp32-s3-devkitc-1', nameKey: 'esp32s3DevkitLayout', subtitleKey: 'esp32s3DevkitSubtitle',
      compatibleKey: 'esp32-s3-devkitc-1Compatible', sharedContactCount: 44,
      profileIds: ['esp32-s3-devkitc-1','esp32-s3-devkitc-1-octal'], defaultProfile:'esp32-s3-devkitc-1',
      references: [
        {key:'esp32s3QuadReference',profileIds:['esp32-s3-devkitc-1']},
        {key:'esp32s3OctalReference',profileIds:['esp32-s3-devkitc-1-octal']}
      ]
    }
  ];
  const grouped = new Set(definitions.flatMap(layout => layout.profileIds));
  const layouts = definitions.map(definition => {
    const profiles = definition.profileIds.map(id => {
      if (!byId.has(id)) throw new Error(`Missing pin reference: ${id}`);
      return byId.get(id);
    });
    // Explicit header families share contact positions. Signal names, electrical
    // capabilities and optional programming connectors belong to each reference.
    const signature = profile => definition.geometryConnectors
      ? profile.pins.filter(pin => definition.geometryConnectors.includes(pin.connector))
        .map(pin => [pin.physicalLabel, pin.position.x, pin.position.y, pin.position.side])
      : profile.pins.map(pin => [pin.number, pin.name, pin.type]);
    const physicalPins = signature(profiles[0]);
    if (definition.sharedContactCount && physicalPins.length !== definition.sharedContactCount) {
      throw new Error(`Incomplete shared header: ${definition.id}`);
    }
    for (const profile of profiles) {
      const pins = signature(profile);
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
