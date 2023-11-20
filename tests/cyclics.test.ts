import { groupActivityByAttribute } from '../src/selection';
import * as inputs from './inputs';
import { parseComplete } from '../src/parsers/parseComplete';

test('compute cyclic strength', () => {
  let c = parseComplete(inputs.cyclics.basic);
  expect(c[0].activities[0].cyclicStrength).toBe(0);
  c = parseComplete(inputs.cyclics.weighty);
  expect(c[0].activities[0].cyclicStrength).toBe(2);
});

test('can group activity by cyclic indicators', () => {
  let g = groupActivityByAttribute(parseComplete(inputs.select.equal));
  expect(g.bySign).toHaveProperty(['-']);
  expect(g.bySign).toHaveProperty(['0']);
  expect(g.bySign).toHaveProperty(['+']);
});


test('can group activity by multiple cyclic indicators', () => {  
    let g = groupActivityByAttribute(parseComplete(inputs.select.extrastrength));
    expect(g.bySign).toHaveProperty(['---']);
    expect(g.bySign).toHaveProperty(['0']);
    expect(g.bySign).toHaveProperty(['+']);
})