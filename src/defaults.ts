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
  { symbol: '-', name: 'Drain', weight: -1 },
  { symbol: '+', name: 'Boost', weight: 1 },
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
  cyclics: /\W?([\+|\-])\W?/g,
};

export interface Config {
  cyclicSelectionAlg: string;
}

// more of a sequence
export const orderingAlgo = '+++---';
// may want to increase for more granularity
export const integerWeightFactor = 4;
// split in the middle
export const startWeight = Math.pow(10, integerWeightFactor) / 2;
// could adjust if list gets longer
export const positionWeight = 20;

// used to fiill schedules
export const timeStep = 5;

// how firmly do we adhere to the cyclic algoritm 0 = cyclics aren't considered
export const algoStrength = 100;
// how far does the cyclic random walk go before it forces a reverse?
export const maxCyclicWalk = 5;
// base value of a cyclic indicator
export const cyclicStepWeight = 10;
// how much to increase step weight for algo sign count
export const cyclicStepWeightMultiplier = 0;
// how much to revert to mean of cyclic selection, negative if algo sign != state sign
export const cyclicStateMultiplier = 5;
// starting point for cyclic strength distribution
export const baseStrengthWeight = 10;
// when selecting cyclic strength distribution, how much to favor bigger strengths
// <1 = favor smaller, >1 = more, 0 = equal distribution between strengths
export const strengthSelectionMultiplier = 5;
