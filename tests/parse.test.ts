import '../src/parse';
import * as input from './inputs';
import { parseCyclics } from '../src/parse';
import { parseLine } from '../src/parsers/parseLine';

test('can parse cyclics', () => {
  const inputCyclics = parseCyclics(input.cyclics.basic);
  expect(inputCyclics.cyclics).toHaveLength(2);
});

test('can parse context cyclics', () => {
  const inputCyclics = parseCyclics(input.cyclics.justContext);
  expect(inputCyclics.cyclics).toHaveLength(1);
});

test('can slice edge cases', () => {
  const act = parseLine(input.edgeCases.one);
  expect(act.input.splitPoint).toBe(33);
});
