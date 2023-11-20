import { Context } from './types/context';
import { Activity } from './types/activity';
import config from './config';
import { Config } from './types/config';
import { selectActivitiesUsingWeights } from './selectors/selectActivitiesUsingWeights';
import { getActivitiesForContexts } from './models/activity/getActivitiesForContexts';
import { parseComplete } from './parsers/parseComplete';
import { canBeSelected } from './selectors/canBeSelected';
import { sortActivityRandom } from './models/activity/sortActivityRandom';
import { sortActivityByWeight } from './models/activity/sortActivityByWeight';
import { logWeights } from './utils';

// whether we are running standalone or as a module
const isLocal = require.main === module;
let fileName = isLocal ? './examples/plan.acr' : module.path + '/../../examples/simple.acr';

export function select(text: string, count = 1, cfg: object = config) {
  return doSelection(parseComplete(text), count);
}

export function selectAlgo(text: string, count = 1, cfg: Config = config) {
  cfg = { ...config, ...cfg, ...{ useAlgorithm: true } };
  return doSelection(parseComplete(text), count, cfg);
}

export function selectOrdered(text: string, count = 1, cfg: Config = config) {
  // override defaults
  cfg = { ...config, ...cfg, ...{ useAlgorithm: false, selectionType: 'ordered' } };
  return doSelection(parseComplete(text), count, cfg);
}

export function selectRandom(text: string, count = 1, cfg: Config = config) {
  // override defaults
  cfg = { ...config, ...cfg, ...{ useAlgorithm: false, selectionType: 'random' } };
  return doSelection(parseComplete(text), count, cfg);
}

// run selection process
export function doSelection(ctxs: Context[], count: number = 1, cfg: Config = config): Activity[] {
  // selecting from list
  let finalActs: Activity[] = [];
  let sequence = cfg.orderingAlgo.repeat(100);
  // for debugging
  let strengths = [];

  // replace defaults with params
  cfg = { ...config, ...cfg };

  // random or ordered
  if (cfg.useAlgorithm === false) {
    finalActs = getActivitiesForContexts(ctxs);
    //TODO: incorporate canBeSelected check, move count inside sortActivity* fn
    if (cfg.selectionType === 'ordered') {
      // add select using weights
      finalActs = sortActivityByWeight(finalActs).slice(0, count);
    } else if (cfg.selectionType === 'random') {
      finalActs = sortActivityRandom(finalActs).slice(0, count);
    }
  } else {
    // iterate through selection sequence steps
    for (let i = 0; i < count; i++) {
      console.log('Start: ', sequence.slice(0, 6));
      let selectedActs: Activity[] = [];
      let signs = getAttributeGroups(ctxs, sequence, cfg);

      //expire non signs
      let str = selectStrengthGroup(ctxs, sequence, signs.sign, cfg);
      strengths.push(str.strength);

      // if match, chop off n from sequence
      if (signs.sign == sequence[0]) {
        sequence = sequence.slice(Math.abs(parseInt(str.strength)));
      }

      if (!str.group) {
        console.debug('No Activities for ', str.strength);
        break;
      }

      ctxs.forEach((c) => {
        c.activities.forEach((act) => {
          if (canBeSelected(act)) {
            selectedActs.push(act);
          }
        });
      });

      // console.log('');
      finalActs.push(...selectActivitiesUsingWeights(selectedActs));

      if (process.env.NODE_ENV !== 'test') {
        console.debug(sequence);
        console.debug('🎲', signs.seed.toFixed(4));
        logWeights(signs.weights);
        console.debug('Selected Sign: ', signs.sign);

        console.debug('🎲', str.seed.toFixed(4));
        logWeights(str.weights);
        console.debug('Selected Str:', str.strength);
        console.log('ST: ', strengths);

        console.debug('Activities Available', str.group.filter(canBeSelected).length);
      }
    }
  }

  return finalActs;
}

/**
 * step 1 in cyclic selection, figure out what sign to use 
 * @param ctxs  - all contexts
 * @param algo  - string from user, indicates what values to look for in inputs
 * @param cfg   - autocal config ( cyclicStepWeight, cyclicStepWeightMultiplier )
 * @returns  { group: bySign[currentSign], sign: currentSign, weights: relativeSignWeight, seed };

 */
export function getAttributeGroups(ctxs: Context[], algo: string, cfg: Config) {
  // { "+": [ Activities ], "-": [ Activities ], "0": [ Activities ]}
  const { bySign: byAttribute } = groupActivityByAttribute(ctxs);

  let signCounts: { [index: string]: number } = {};
  let total = 0;
  let relativeSignWeight: { [index: string]: number } = {};
  let currentSign = '0';

  // get values from context size to use when calculating sign weight
  for (const key in byAttribute) {
    if (byAttribute[key]) {
      const acts = byAttribute[key];
      signCounts[key] = acts.length;
      total += acts.length;
    }
  }

  // incorporate algo so we aren't only distributing
  let seqStep = algo[0];
  let signSteps = 0;

  // does the ctx have this sequence step?
  // how many repetitions of seqStep? more means to favor this seqstep
  while (byAttribute[seqStep] && algo[signSteps] === seqStep) {
    signSteps++;
    // = step weight + multi * signsteps = 10 + i*5
    let amtToAdd = cfg.cyclicStepWeight + signSteps * cfg.cyclicStepWeightMultiplier;
    signCounts[seqStep] += amtToAdd;
    // remove this amount from others
    // for (const k in values) {
    //   if (k !== seqStep) {
    //     // proportionate amount to decrease
    //     values[k] -= Math.ceil(amtToAdd / (Object.keys(values).length - 1));
    //   }
    // }
  }

  // add up total of values for distribution
  let valueTotal = Object.values(signCounts).reduce((a: number, b: number) => {
    return a + b;
  }, 0);

  if ( total !== valueTotal ){ console.warn('Missing Activities', total, valueTotal) }

  // calculate weights by relative size distribution with algo applied
  for (const key in signCounts) {
    if (signCounts[key]) {
      const amt = signCounts[key];
      relativeSignWeight[key] = amt / valueTotal;
    }
  }

  // 3 +s

  let weightKeys = Object.keys(relativeSignWeight).sort();
  let seed = Math.random();
  let weightTotal = 0;
  for (let i = 0; i < weightKeys.length; i++) {
    const key = weightKeys[i];
    // add value to total to check against for pass
    weightTotal += relativeSignWeight[key];
    if (seed < weightTotal) {
      // all the object obnoxiousness above is for this, could use a tuple
      currentSign = key;
      break;
    }
  }

  if (currentSign == '') {
    console.error('No sign selected', seed, relativeSignWeight);
  }

  if (config.randomSelection == false) {
    // override for deterministic operation
    currentSign = seqStep;
  }

  return { group: byAttribute[currentSign], sign: currentSign, weights: relativeSignWeight, seed };
}

// step 2 in selection, select inside sign
export function selectStrengthGroup(ctxs: Context[], algo: string, selectedSign: string, cfg: Config) {
  //   let byStrength: { [index: string]: Activity[] };
  let { byStrength } = groupActivityByAttribute(ctxs);
  // mark activity as unavailable
  let seqSign = algo[0];
  let signSteps = 0;
  // integers for weights
  let values: { [index: string]: number } = {};
  let weights: { [index: string]: number } = {};
  let total = 0;
  let algoKey: string;

  // sequence matches selection
  // value according to depth
  if (seqSign === selectedSign) {
    while (algo[signSteps] === selectedSign) {
      signSteps++;
      // assign values as we go
      let val = cfg.baseStrengthWeight + signSteps * cfg.strengthSelectionMultiplier;
      // --- or +++ or ***
      algoKey = seqSign.repeat(signSteps);
      values[algoKey] = val;
      total += val;
    }

    if (selectedSign === '-') {
      // inverse weight
      signSteps *= -1;
    }
  } else {
    // sequence / selection mismatch
    // weight according to size distribution
    Object.keys(byStrength).forEach((str) => {
      if (str[0] == selectedSign) {
        const acts = byStrength[str];
        // --- : [Act][Act][Act]
        values[selectedSign.repeat(parseInt(str[1]))] = acts.length;
        total += acts.length;
      }
    });
  }

  // convert values ( int ) to weight ( < 1 )
  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      const value = values[key];
      weights[key] = value / total;
    }
  }

  const weightKeys = Object.keys(weights);
  const seed = Math.random();
  let strengthTarget = '';
  let weightTotal = 0;
  for (let i = 0; i < weightKeys.length; i++) {
    const key = weightKeys[i];
    // add value to total to check against for pass
    weightTotal += weights[key];
    if (seed <= weightTotal) {
      strengthTarget = convertAlgoKeyToStrength(key);
      if (!byStrength.hasOwnProperty(strengthTarget)) {
        // no acts available for this strength
        continue;
      }
      break;
    }
  }

  if (config.randomSelection == false) {
    strengthTarget = convertAlgoKeyToStrength(algoKey);
  }

  return {
    group: byStrength[strengthTarget],
    strength: strengthTarget,
    weights,
    seed,
  };
}

function convertAlgoKeyToStrength(key: string): string {
  let strengthTarget: string;
  // convert key ( +++ ) to weight ( 3 ) --- = -3
  if (key.indexOf('0') !== -1) {
    strengthTarget = '0';
  } else {
    const sign = key.indexOf('-') !== -1 ? '-' : key.indexOf('+') !== -1 ? '+' : '';
    strengthTarget = sign + key.length;
  }
  return strengthTarget;
}

export function groupActivityByAttribute(ctxs: Context[]) {
  let bySign: { [index: string]: Activity[] } = {};
  // keyed by Activity cyclicStrength as string
  let byStrength: { [index: string]: Activity[] } = {};

  // all the activities
  let acts: Activity[] = [];
  ctxs.forEach((c) => {
    acts.push(...c.activities);
  });

  // iterate through each for sorting
  acts.forEach((a) => {
    let k = a.cyclicStrength;
    // used to key bySign obj { -, 0, + }
    let sign: string = k > 0 ? '+' : k < 0 ? '-' : '0';
    // used to key byStr obj { -1, 0, +1 }
    let posneg: string = k > 0 ? '+' : k < 0 ? '-' : '';
    // '-1', '0', '+1'
    let ks: string = posneg + Math.abs(a.cyclicStrength).toString();

    if (ks == '') {
      console.error('No KS Here');
      debugger;
    }

    // add/create strength groups
    (byStrength[ks] = byStrength[ks] || []).push(a);

    // add/create signed groups
    (bySign[sign] = bySign[sign] || []).push(a);
  });

  return { bySign, byStrength };
}
