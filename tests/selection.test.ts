import * as inputs from './inputs';
import { parseComplete } from '../src/models/contextFn';

test('can select using an algorithm', () => {
  let ctxs = parseComplete(inputs.select.equal);
  console.log(ctxs);
});
