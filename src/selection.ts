import { Context } from './models/context';
import { Activity } from './models/activity';
import {
  baseStrengthWeight,
  strengthSelectionMultiplier,
  orderingAlgo,
} from './defaults';
import { selectActivitiesUsingWeights } from './models/contextFn';
import { cyclicStepWeight, cyclicStepWeightMultiplier } from './defaults';
import { canBeSelected } from './models/activityFn';

// run selection process
export function doSelection(
  ctxs: Context[],
  count: number = 1,
  config?: object
) {
  // selecting from list
  let finalActs: Activity[] = [];
  let sequence = orderingAlgo.repeat(5);
  // for debugging
  let strengths = [];

  // iterate through selection sequence steps
  for (let i = 0; i < count; i++) {
    console.log(sequence);
    let selectedActs: Activity[] = [];
    let signs = selectSignGroup(ctxs, sequence);
    console.log('Sign', signs.sign, 'weight', signs.weights, signs.seed);

    //expire non signs
    let str = selectStrengthGroup(ctxs, sequence, signs.sign);

    console.log(str.weights, str.seed);
    console.log('Strength', str.strength);
    strengths.push(str.strength);

    // if match, chop off n from sequence, move on if 0
    if (signs.sign == sequence[0] || signs.sign === '0') {
      sequence = sequence.slice(Math.abs(parseInt(str.strength)));
    }

    if (str.group) {
      str.group.forEach((act: Activity) => {
        act.available = true;
      });
      console.log('Made Available', str.group.length);
    } else {
      console.log('No Activities for ', str.strength);
    }

    ctxs.forEach((c) => {
      c.activities.forEach((act) => {
        if (canBeSelected(act)) {
          selectedActs.push(act);
        }
      });
    });

    console.log('');
    finalActs.push(...selectActivitiesUsingWeights(selectedActs));
  }
  console.log('ST: ', strengths);

  return finalActs;
}

// step 1 in selection, figure out what sign to use
export function selectSignGroup(ctxs: Context[], algo: string, state = 0) {
  const { bySign } = groupActivityByCyclic(ctxs);
  let values: { [index: string]: number } = {};
  let total = 0;
  let weights: { [index: string]: number } = {};
  let sign = '';

  // get values from context size
  for (const key in bySign) {
    if (bySign[key]) {
      const acts = bySign[key];
      values[key] = acts.length;
      total += acts.length;
    }
  }

  // incorporate algo so we aren't only distributing
  let seqStep = algo[0];
  let signSteps = 0;

  // how many repetitions of seqStep? more means to favor this seqstep
  while (algo[signSteps] === seqStep) {
    signSteps++;
    // = step weight + multi * signsteps = 10 + i*5
    let amtToAdd = cyclicStepWeight + signSteps * cyclicStepWeightMultiplier;
    values[seqStep] += amtToAdd;
    // remove this amount from others
    // for (const k in values) {
    //   if (k !== seqStep) {
    //     // proportionate amount to decrease
    //     values[k] -= Math.ceil(amtToAdd / (Object.keys(values).length - 1));
    //   }
    // }
  }

  // add up total of values for distribution
  let valueTotal = Object.values(values).reduce((a: number, b: number) => {
    return a + b;
  }, 0);

  // calculate weights by relative size distribution with algo applied
  for (const key in values) {
    if (values[key]) {
      const amt = values[key];
      weights[key] = amt / valueTotal;
    }
  }

  // 3 +s

  let weightKeys = Object.keys(weights).sort();
  let seed = Math.random();
  let weightTotal = 0;
  for (let i = 0; i < weightKeys.length; i++) {
    const key = weightKeys[i];
    // add value to total to check against for pass
    weightTotal += weights[key];
    if (seed < weightTotal) {
      // all the object obnoxiousness above is for this, could use a tuple
      sign = key;
      break;
    }
  }

  if (sign == '') {
    console.error('No sign selected', seed, weights);
  }

  return { group: bySign[sign], sign, weights, seed };
}

// step 2 in selection, select inside sign
export function selectStrengthGroup(
  ctxs: Context[],
  algo: string,
  selectedSign: string,
  state: number = 0
) {
  //   let byStrength: { [index: string]: Activity[] };
  let { byStrength } = groupActivityByCyclic(ctxs);
  // mark activity as unavailable
  let seqSign = algo[0];
  let signSteps = 0;
  // integers for weights
  let values: { [index: string]: number } = {};
  let weights: { [index: string]: number } = {};
  let total = 0;

  // sequence matches selection
  // value according to depth
  if (seqSign === selectedSign) {
    while (algo[signSteps] === selectedSign) {
      signSteps++;
      // assign values as we go
      let val = baseStrengthWeight + signSteps * strengthSelectionMultiplier;
      values[seqSign.repeat(signSteps)] = val;
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
      // convert key ( +++ ) to weight ( 3 ) --- = -3
      if (key.indexOf('0') !== -1) {
        strengthTarget = '0';
      } else {
        const sign =
          key.indexOf('-') !== -1 ? '-' : key.indexOf('+') !== -1 ? '+' : '';
        strengthTarget = sign + key.length;
      }

      if (!byStrength.hasOwnProperty(strengthTarget)) {
        // no acts available for this strength
        continue;
      }
      break;
    }
  }

  return {
    group: byStrength[strengthTarget],
    strength: strengthTarget,
    weights,
    seed,
  };
}

export function groupActivityByCyclic(ctxs: Context[]) {
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
