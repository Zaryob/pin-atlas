/* SPDX-License-Identifier: GPL-3.0-or-later */
export const boardFamilies = [
  {
    id: 'raspberry-pi',
    nameKey: 'familyRaspberryPi',
    items: [
      { type: 'layout', id: 'pico-family' },
      { type: 'layout', id: 'raspberry-pi-40' },
      { type: 'layout', id: 'rp2040' },
      {
        type: 'package-group',
        id: 'rp2350',
        name: 'RP2350',
        subtitleKey: 'rp2350Subtitle',
        defaultLayout: 'rp2350a',
        packages: [
          { id: 'rp2350a', label: 'QFN-60' },
          { id: 'rp2350b', label: 'QFN-80' }
        ]
      }
    ]
  },
  {
    id: 'arduino',
    nameKey: 'familyArduino',
    items: [
      { type: 'layout', id: 'arduino-uno' },
      { type: 'layout', id: 'arduino-nano' },
      { type: 'layout', id: 'arduino-mega-2560' },
      { type: 'layout', id: 'arduino-micro' }
    ]
  },
  {
    id: 'seeed',
    nameKey: 'familySeeed',
    items: [
      { type: 'layout', id: 'seeed-xiao' }
    ]
  },
  {
    id: 'adafruit',
    nameKey: 'familyAdafruit',
    items: [
      { type: 'layout', id: 'adafruit-feather-rp2040' }
    ]
  },
  {
    id: 'teensy',
    nameKey: 'familyTeensy',
    items: [
      { type: 'layout', id: 'teensy-41' }
    ]
  },
  {
    id: 'beagleboard',
    nameKey: 'familyBeagleBoard',
    items: [
      { type: 'layout', id: 'beaglebone-black' }
    ]
  },
  {
    id: 'microbit',
    nameKey: 'familyMicrobit',
    items: [
      { type: 'layout', id: 'microbit-v2' }
    ]
  },
  {
    id: 'espressif',
    nameKey: 'familyEspressif',
    items: [
      { type: 'layout', id: 'esp32-devkitc-v4' },
      { type: 'layout', id: 'esp32-s3-devkitc-1' },
      { type: 'layout', id: 'esp32-c6-devkitc-1' },
      { type: 'layout', id: 'esp32-c3-devkitm-1' }
    ]
  },
  {
    id: 'stm32',
    nameKey: 'familyStm32',
    items: [
      { type: 'layout', id: 'blue-pill' },
      { type: 'layout', id: 'stm32f042k6t6' },
      { type: 'layout', id: 'stm32l432kcu6' },
      { type: 'layout', id: 'stm32f103c8t6' },
      { type: 'layout', id: 'stm32f103rbt6' },
      { type: 'layout', id: 'stm32f103vbt6' },
      { type: 'layout', id: 'stm32f401ret6' },
      { type: 'layout', id: 'stm32f411ret6' },
      { type: 'layout', id: 'stm32g474ret6' },
      { type: 'layout', id: 'stm32h723zgt6' },
      { type: 'layout', id: 'stm32f446ret6' },
      { type: 'layout', id: 'stm32l476rgt6' },
      { type: 'layout', id: 'stm32f072rbt6' },
      { type: 'layout', id: 'stm32l053r8t6' },
      { type: 'layout', id: 'stm32l152ret6' },
      { type: 'layout', id: 'stm32f407vgt6' },
      { type: 'layout', id: 'stm32f405rgt6' },
      { type: 'layout', id: 'stm32f303ret6' }
    ]
  },
  {
    id: 'stm32-nucleo',
    nameKey: 'familyStm32Nucleo',
    items: [
      { type: 'layout', id: 'nucleo-32' },
      { type: 'layout', id: 'nucleo-64' },
      { type: 'layout', id: 'nucleo-h723zg' }
    ]
  },
  {
    id: 'microchip',
    nameKey: 'familyMicrochip',
    items: [
      {
        type: 'package-group',
        id: 'atmega328p',
        name: 'ATmega328P',
        subtitleKey: 'atmega328pSubtitle',
        defaultLayout: 'atmega328p-pdip28',
        packages: [
          { id: 'atmega328p-pdip28', label: 'PDIP-28' },
          { id: 'atmega328p-tqfp32', label: 'TQFP-32' },
          { id: 'atmega328p-qfn32', label: 'QFN-32' },
          { id: 'atmega328p-qfn28', label: 'QFN-28' }
        ]
      },
      { type: 'layout', id: 'atmega2560-tqfp100' },
      { type: 'layout', id: 'atmega2561-tqfp64' }
    ]
  },
  {
    id: 'nvidia',
    nameKey: 'familyNvidia',
    items: [
      { type: 'layout', id: 'jetson-orin-nano' }
    ]
  }
];


export const homeFilterChips = [
  {id:'all', labelKey:'allFamilies'},
  ...boardFamilies.filter(family => !family.id.startsWith('stm32-')).map(family => ({id:family.id, labelKey:family.nameKey})),
  {id:'chips', labelKey:'familyChips'}
];

const featuredProfiles = [
  ['pico-family','pico2w'],
  ['esp32-devkitc-v4','esp32-devkitc-v4'],
  ['arduino-nano','arduino-nano-classic'],
  ['seeed-xiao','xiao-rp2040'],
  ['blue-pill','blue-pill'],
  ['rp2040','rp2040']
];

export function featuredCards(layouts, t = (key, params, fallback) => fallback || key) {
  return featuredProfiles.map(([layoutId, profileId]) => {
    const profile = layouts.find(layout => layout.id === layoutId)?.profiles.find(profile => profile.id === profileId);
    if (!profile) throw new Error(`Missing featured model: ${profileId}`);
    const chip = ['qfn','lqfp','dip'].includes(profile.layout);
    return {layoutId, profileId, name:profile.name, family:profile.family,
      description:t('board.'+profile.id, {}, profile.subtitle),
      specs:[`${profile.uniqueGPIOCount ?? profile.gpioCount} GPIO`, profile.voltage,
        chip ? profile.packageName || `${profile.layout.toUpperCase()}-${profile.packagePins}` : profile.mcu].filter(Boolean).join(' · ')};
  });
}
