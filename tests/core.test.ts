import { readFile } from '../src/read';
import * as inputs from './inputs';
import { getPlanListFromText, addRawContext, getActivityListForContext } from '../src/index';
const f = readFile('./examples/plan.acr');

test('Can get all', () => {
  console.log(getPlanListFromText(f));
});

test('Can add Raw Context', () => {
  const l = addRawContext('before', 'test');
  console.log(l);
});

test('Can get activity list for context', () => {
  const l = getActivityListForContext(inputs.contexts.long, '0');
  expect(l).toHaveLength(100);
});
