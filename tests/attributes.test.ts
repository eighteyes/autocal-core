import { parseComplete } from '../src/parsers/parseComplete';
import { parseLine } from '../src/parsers/parseLine';
import config from '../src/config';
import { attributes } from './inputs';

test('collect raw attributes', () => {
  let e = parseLine(attributes.many);
  expect(e.input.attributes).toHaveLength(3);
});

test('weight activities based on attributes', () => {
  let ctx = parseComplete(attributes.all)[0];
  const totalWeight =
    config.attributeList.reduce((a, b) => {
      return a + b.weight;
    }, 0) + config.startWeight;
  expect(ctx.activities[0].integerWeight).toBe(totalWeight);
});

test('count multiple attributes when weighting', () => {
  let ctx = parseComplete(attributes.multi)[0];
  const totalWeight =
    config.attributeList.filter((a) => {
      return a.symbol == '!';
    })[0].weight *
      3 +
    config.startWeight;
  expect(ctx.activities[0].integerWeight).toBe(totalWeight);
});
