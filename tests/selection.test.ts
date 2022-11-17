import * as inputs from './inputs';
import { orderingAlgo } from '../src/defaults';
import { parseComplete } from '../src/models/contextFn';
import { selectSignGroup, selectStrengthGroup } from '../src/selection';

test('can select a sign using an algorithm', () => {
  let ctxs = parseComplete(inputs.select.equal);
  let signs = [];
  for (let i = 0; i <= 10; i++) {
    let { sign } = selectSignGroup(ctxs, orderingAlgo);
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
    let { strength } = selectStrengthGroup(ctxs, '---+++');
    strengths.push(strength);
  }
  // de dupe
  let strengthsSet = new Set(strengths);
  console.log(strengths);
  expect(strengthsSet.size).toEqual(2);
});
