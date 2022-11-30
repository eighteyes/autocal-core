import * as inputs from './inputs';
import config from '../src/config';
import { parseComplete } from '../src/models/contextFn';
import { selectSignGroup, selectStrengthGroup } from '../src/selection';

test('can select a sign using an algorithm', () => {
  let ctxs = parseComplete(inputs.select.equal);
  let signs = [];
  let algo: string = '+-'.repeat(10);
  for (let i = 0; i <= 10; i++) {
    let { sign } = selectSignGroup(ctxs, algo, config);
    // advance algo
    algo = algo.split('').slice(1).join('');
    signs.push(sign);
  }
  // de dupe
  let signsSet = new Set(signs);
  expect(signsSet.size).toEqual(3);
});

test('can select a strength using an algorithm', () => {
  let ctxs = parseComplete(inputs.select.extrastrength);
  let strengths = [];
  for (let i = 0; i <= 10; i++) {
    let { strength } = selectStrengthGroup(ctxs, '---+++', '-', config);
    strengths.push(strength);
  }
  // de dupe
  let strengthsSet = new Set(strengths);
  // -2 and -3 from algo, no -1 in inputs
  expect(strengthsSet.size).toEqual(2);
});
