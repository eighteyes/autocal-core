export const options = {
  applyPositionWeight: true,
};

export const attributeList: Attribute[] = [
  { symbol: '!', name: 'Urgent', weight: 200 },
  { symbol: '$', name: 'Important', weight: 200 },
  { symbol: '*', name: 'Required', weight: 400 },
  { symbol: '`', name: 'Nudge', weight: 20 },
];

// { symbol: "+", name: 'Energizing', weight: 0 },
// { symbol: "-", name: 'Draining', weight: 0 },

export const cyclicList: Cyclic[] = [
  { symbol: '-', name: 'Draining', weight: -1 },
  { symbol: '+', name: 'Energizing', weight: 1 },
];

export const times = {
  m: 'months',
  h: 'hours',
  d: 'days',
  w: 'weeks',
};

export const regex = {
  contextHashMatch: /^#*./,
  duration: /\b\d*[mhdw]/g,
  content: /^([A-Za-z]\w+\s)$/,
  tag: /#([.\w-]+\S)/g,
  attributes: new RegExp('\\B[' + attributeList.map((e) => e.symbol) + ']+', 'g'),
  lettersOnly: /[^\w]/g,
  dependencies: /[<>]{1,}/g,
  requiredDependencies: /<<|>>/g,
  cyclics: /\W([\+|\-])\W/g,
};

// /\s[!\$\^\*]+/g

export const orderingAlgo = '^+';
// may want to increase for more granularity
export const integerWeightFactor = 4;
// split in the middle
export const startWeight = Math.pow(10, integerWeightFactor) / 2;
// could adjust if list gets longer
export const positionWeight = 20;

// used to fiill schedules
export const timeStep = 5;
