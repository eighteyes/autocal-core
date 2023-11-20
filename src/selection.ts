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
      let stepAttribute = sequence[0];
      let selectedActs: Activity[] = selectByAttribute(ctxs, stepAttribute);

      // remove first from sequence for next iteration
      sequence = sequence.slice(1);

      if (selectedActs.length === 0) {
        console.debug('No Activities for ', stepAttribute);
        break;
      }

      finalActs.push(...selectActivitiesUsingWeights(selectedActs));
    }
  }

  return finalActs;
}

/**
 * step 1 in cyclic selection, figure out what sign to use 
 * @param ctxs  - all contexts
 * @param algo  - string from user, indicates what values to look for in inputs
 * @param cfg   - autocal config ( cyclicStepWeight, cyclicStepWeightMultiplier )
 * @returns  { selection: Activity[], sign: currentSign, weights: relativeSignWeight };

 */
export function selectByAttribute(ctxs: Context[], stepAttribute: string) {
  // { "+": [ Activities ], "-": [ Activities ], "0": [ Activities ]}
  const { byAttribute: byAttribute } = groupActivityByAttribute(ctxs);
  return byAttribute[stepAttribute]
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
  let byAttribute: { [index: string]: Activity[] } = {};
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
    // used to key byAttribute obj { -, 0, + }
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
    (byAttribute[sign] = byAttribute[sign] || []).push(a);
  });

  return { byAttribute, byStrength };
}
