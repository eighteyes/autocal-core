import { Config, ConfigRegex } from './types/config';

let regex: ConfigRegex;
let config: Config = {
  applyPositionWeight: false,

  // 0 tasks must be explicitly in the algo if false - doesn't work
  randomSelection: true,

  attributeList: [
    { symbol: '!', name: 'Urgent', weight: 200 },
    { symbol: '$', name: 'Important', weight: 200 },
    { symbol: '*', name: 'Required', weight: 400 },
    { symbol: '`', name: 'Nudge', weight: 20 },
    { symbol: '-', name: 'Drain', weight: -100 },
    { symbol: '+', name: 'Boost', weight: 100 },
  ],

  attributes: [],

  times: {
    m: 'months',
    h: 'hours',
    d: 'days',
    w: 'weeks',
  },
  timeStep: 5,

  // use algorithm at all
  useAlgorithm: true,

  // alternative to use if `useAlgo` above is false
  selectionType: 'ordered',

  // more of a sequence
  orderingAlgo: '-+',
  integerWeightFactor: 4,
  startWeight: 0,
  positionWeight: 20,

  algoStrength: 100,
  maxCyclicWalk: 5,
  cyclicStepWeight: 10,
  cyclicStepWeightMultiplier: 0,
  cyclicStateMultiplier: 5,
  baseStrengthWeight: 10,
  strengthSelectionMultiplier: 2,
  regex: regex,
};

regex = {
  flags: /^[#x]/,
  contextHashMatch: /^#*./,
  duration: /\b\d*[mhdw]\b/g,
  content: /^([A-Za-z]\w+\s)$/,
  tag: /#([.\w-]+\S)/g,
  attributes: new RegExp('\\B[' + config.attributeList.map((e) => e.symbol) + ']+', 'g'),
  lettersOnly: /[^\w]/g,
  vowels: /[aeiou]/g,
  dependencies: /[<>]{1,}/g,
  requiredDependencies: /<<|>>/g,
  cyclics: /\W?([\+|\-])\W?/g,
};

// b/c these values depend on other config
config.regex = regex;
config.startWeight = Math.pow(10, config.integerWeightFactor) / 2;
config.attributes = config.attributeList.map((e) => e.symbol);

export default config;
