import { parseCyclics } from '../src/parse';
import { groupActivityByCyclic } from '../src/selection';
import * as inputs from './inputs';
import { parseComplete } from '../src/models/contextFn';

test('compute cyclic strength', () => {
  let c = parseComplete(inputs.cyclics.basic);
  expect(c[0].activities[0].cyclicStrength).toBe(0);
  c = parseComplete(inputs.cyclics.weighty);
  expect(c[0].activities[0].cyclicStrength).toBe(2);
});

test('can group activity by cyclic indicators', () => {
  let g = groupActivityByCyclic(parseComplete(inputs.select.equal));
  expect(g.bySign).toHaveProperty(['-']);
  expect(g.bySign).toHaveProperty(['0']);
  expect(g.bySign).toHaveProperty(['+']);
});
