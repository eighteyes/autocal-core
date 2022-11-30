import { parseComplete, parseLine } from '../src/models/contextFn';
import { attributeList, startWeight } from '../src/config';
import { attributes } from './inputs';

test('collect raw attributes', () => {
  let e = parseLine(attributes.many);
  expect(e.input.attributes).toHaveLength(3);
});

test('weight activities based on attributes', () => {
  let ctx = parseComplete(attributes.all)[0];
  const totalWeight =
    attributeList.reduce((a, b) => {
      return a + b.weight;
    }, 0) + startWeight;
  expect(ctx.activities[0].integerWeight).toBe(totalWeight);
});

test('count multiple attributes when weighting', () => {
  let ctx = parseComplete(attributes.multi)[0];
  const totalWeight =
    attributeList.filter((a) => {
      return a.symbol == '!';
    })[0].weight *
      3 +
    startWeight;
  expect(ctx.activities[0].integerWeight).toBe(totalWeight);
});
