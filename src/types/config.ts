import { Attribute } from './attribute';

export interface Config {
  regex: ConfigRegex;
  useAlgorithm: boolean;
  applyPositionWeight: boolean;
  randomSelection: boolean;
  attributeList: Attribute[];
  cyclicList: Attribute[];
  times: object;

  // sequence of pattern selection
  orderingAlgo: string;

  // adds granularity to weights, 10^n
  integerWeightFactor: number;

  // start in the middle
  startWeight: number;

  // needs to adjust if list gets longer
  positionWeight: number;

  // used to fiill schedules - tbd
  timeStep: number;

  // how firmly do we adhere to the cyclic algoritm 0: cyclics aren't considered
  algoStrength: number;
  // how far does the cyclic random walk go before it forces a reverse?
  maxCyclicWalk: number;
  // base value of a cyclic indicator
  cyclicStepWeight: number;

  // how much to increase step weight for algo sign count
  cyclicStepWeightMultiplier: number;
  // how much to revert to mean of cyclic selection, negative if algo sign != state sign
  cyclicStateMultiplier: number;
  // starting point for cyclic strength distribution
  baseStrengthWeight: number;
  // when selecting cyclic strength distribution, how much to favor bigger strengths
  // <1: favor smaller, >1: more, 0: equal distribution between strengths
  strengthSelectionMultiplier: number;

  selectionType: string;
}

export interface ConfigRegex {
  flags: RegExp;
  contextHashMatch?: RegExp;
  vowels?: RegExp;
  duration?: RegExp;
  content?: RegExp;
  tag?: RegExp;
  attributes?: RegExp;
  lettersOnly?: RegExp;
  dependencies?: RegExp;
  requiredDependencies?: RegExp;
  cyclics?: RegExp;
}
