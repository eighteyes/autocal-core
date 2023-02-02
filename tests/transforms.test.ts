import * as t from '../src/text';
import { text as c } from './inputs';

test('can add act to ctx', () => {
  let newCtxPlan = t.addActivityToContext(c.multi, 1, 'test');
  let oldCtxPlan = t.addActivityToContext(c.multi2, 1, 'test');
  expect(newCtxPlan).toBe(c.multi + 'test\n\n');
  expect(oldCtxPlan).toBe(c.multi2 + 'test\n\n');
});
