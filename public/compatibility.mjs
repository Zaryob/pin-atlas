/* SPDX-License-Identifier: GPL-3.0-or-later */
// Model labels are explicit. A shared header never grants another MCU's mux map.
export function compatibleModels(layout) {
  if (!layout.compatibleKey && layout.profiles.length === 1) return [];
  if (layout.id === 'raspberry-pi-40') {
    return [
      ['pi-b-plus','Raspberry Pi Model B+'],
      ['pi-a-plus','Raspberry Pi Model A+'],
      ['pi-2','Raspberry Pi 2 Model B'],
      ['pi-3','Raspberry Pi 3 family'],
      ['raspberry-pi-4','Raspberry Pi 4 Model B'],
      ['pi-5','Raspberry Pi 5'],
      ['pi-zero','Raspberry Pi Zero'],
      ['pi-zero-w','Raspberry Pi Zero W'],
      ['pi-zero-2-w','Raspberry Pi Zero 2 W'],
      ['pi-400','Raspberry Pi 400'],
      ['pi-500','Raspberry Pi 500']
    ].map(([id,name]) => ({id,name,profileId:id === 'raspberry-pi-4' ? id : 'raspberry-pi-40',
      kind:id === 'raspberry-pi-4' ? 'reference' : 'physical',
      detailKey:id === 'raspberry-pi-4' ? 'bcm2711Reference' : 'commonReference'}));
  }
  if (layout.id === 'stm32f103c8t6') {
    return [
      {id:'stm32f103c8t6',name:'STM32F103C8T6',profileId:'stm32f103c8t6',kind:'reference',detail:'LQFP-48'},
      {id:'stm32f103cbt6',name:'STM32F103CBT6',profileId:'stm32f103c8t6',kind:'physical',detail:'LQFP-48'}
    ];
  }
  const modelNames = {
    'esp32-devkitc-v4':'ESP32-DevKitC V4 · WROOM-32E',
    'esp32-devkitc-v4-wrover':'ESP32-DevKitC V4 · WROVER',
    'esp32-s3-devkitc-1':'ESP32-S3-DevKitC-1 · N8',
    'esp32-s3-devkitc-1-octal':'ESP32-S3-DevKitC-1 · N8R8'
  };
  return layout.profiles.map(profile => ({id:profile.id,profileId:profile.id,
    name:modelNames[profile.id] || profile.name,kind:'reference',
    detail:profile.mcu,referenceKey:layout.references.find(reference => reference.profileIds.includes(profile.id))?.key}));
}

export function filterCompatibleModels(models, query, text = model => [model.name,model.detail].join(' ')) {
  const needle=query.trim().toLocaleLowerCase();
  return models.filter(model => text(model).toLocaleLowerCase().includes(needle));
}
