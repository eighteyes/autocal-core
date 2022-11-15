import '../src/parse';
import * as input from './inputs';
import { parseCyclics } from '../src/parse';

test('can parse cyclics', () => {
  const inputCyclics = parseCyclics(input.cyclics.basic);
  expect(inputCyclics.cyclics).toHaveLength(2);
});
