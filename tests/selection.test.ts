import * as inputs from './inputs';
import { orderingAlgo } from '../src/defaults';
import { parseComplete } from '../src/models/contextFn';
import { selectSign } from '../src/selection';

test('can select a sign using an algorithm', () => {
  let ctxs = parseComplete(inputs.select.equal);
  let signs = [selectSign(ctxs, orderingAlgo)];
  for (let i = 0; i <= 10; i++) {
    const element = 10;
    signs.push(selectSign(ctxs, orderingAlgo));
  }
  // de dupe
  let signsSet = new Set(signs);
  expect(signsSet.size).toEqual(3);
  console.log(signs);
});
