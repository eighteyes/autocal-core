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
  let sequence: string = cfg.orderingAlgo.repeat(100);
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

      if ( cfg.insertNoAttrActivities ){
        // prepend a 0 for no attribute activities
        sequence = '0' + sequence;
      }
      

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
 * attribute selection, return acts for a attribute 
 * @param ctxs  - all contexts
 * @param algo  - string from user, indicates what values to look for in inputs
 * @param cfg   - autocal config ( cyclicStepWeight, cyclicStepWeightMultiplier )
 * @returns  Activity[] - all activities with the same attribute
 */
export function selectByAttribute(ctxs: Context[], stepAttribute: string) {
  // { "+": [ Activities ], "-": [ Activities ], "0": [ Activities ]}
  const { byAttribute: byAttribute } = groupActivityByAttribute(ctxs);
  return byAttribute[stepAttribute]
}

export function groupActivityByAttribute(ctxs: Context[]) {
  let byAttribute: { [index: string]: Activity[] } = {};

  // all the activities
  let acts: Activity[] = [];
  ctxs.forEach((c) => {
    acts.push(...c.activities);
  });

  // iterate through each for sorting
  acts.forEach((a) => {
    let attrs: string[] = a.input.attributes;
    if (attrs.length === 0) {
      // no attributes
      (byAttribute['0'] = byAttribute['0'] || []).push(a);
    }
    attrs.forEach((attr) => {
      // init or add to array
      (byAttribute[attr] = byAttribute[attr] || []).push(a);
    });
  });

  return { byAttribute };
}
