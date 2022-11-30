import { Config } from './interfaces/config';

let config: Config = {
  applyPositionWeight: true,

  // 0 tasks must be explicitly in the algo if false
  randomSelection: true,

  attributeList: [
    { symbol: '!', name: 'Urgent', weight: 200 },
    { symbol: '$', name: 'Important', weight: 200 },
    { symbol: '*', name: 'Required', weight: 400 },
    { symbol: '`', name: 'Nudge', weight: 20 },
  ],

  // { symbol: "+", name: 'Energizing', weight: 0 },
  // { symbol: "-", name: 'Draining', weight: 0 },

  cyclicList: [
    { symbol: '-', name: 'Drain', weight: -1 },
    { symbol: '+', name: 'Boost', weight: 1 },
  ],

  times: {
    m: 'months',
    h: 'hours',
    d: 'days',
    w: 'weeks',
  },

  // more of a sequence
  orderingAlgo: '--++--',
  integerWeightFactor: 4,
  startWeight: 0,
  positionWeight: 20,

  timeStep: 5,

  algoStrength: 100,
  maxCyclicWalk: 5,
  cyclicStepWeight: 10,
  cyclicStepWeightMultiplier: 0,
  cyclicStateMultiplier: 5,
  baseStrengthWeight: 10,
  strengthSelectionMultiplier: 2,
  regex: {},
};

let regex = {
  contextHashMatch: /^#*./,
  duration: /\b\d*[mhdw]\b/g,
  content: /^([A-Za-z]\w+\s)$/,
  tag: /#([.\w-]+\S)/g,
  attributes: new RegExp(
    '\\B[' + config.attributeList.map((e) => e.symbol) + ']+',
    'g'
  ),
  lettersOnly: /[^\w]/g,
  dependencies: /[<>]{1,}/g,
  requiredDependencies: /<<|>>/g,
  cyclics: /\W?([\+|\-])\W?/g,
};

// b/c these values depend on other config
config.regex = regex;
config.startWeight = Math.pow(10, config.integerWeightFactor) / 2;

export default config;
