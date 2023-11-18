import * as input from './inputs';
import { parseCyclics } from '../src/parsers/parseCyclics';
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

test('can parse context attributes', () => {
 const ln = parseLine(input.contexts.ctx);
 console.log(ln) 
})

test('can parse content', () => {
  const act = parseLine(input.attributes.many)
  const ctx = parseLine(input.contexts.ctx)
  const ctxa = parseLine(input.contexts.ctxa)
  const tags = parseLine(input.tags.single)
  expect(act.input.content).toBe('Very Important')
  expect(ctx.input.content).toBe('Context')
  expect(ctxa.input.content).toBe('ActContext')
  expect(tags.input.content).toBe('Mow the lawn')
})

test('can parse tags', () => {
  const tags = parseLine(input.tags.single);
  const multiple = parseLine(input.tags.multiple);
  expect(tags.input.tags).toHaveLength(1);
  expect(multiple.input.tags).toHaveLength(2)
})

test('can parse attributes', () => {
  const many = parseLine(input.attributes.many);
  expect(many.input.attributes).toHaveLength(5)
  expect(many.input.attributes[0]).toBe('!')
  expect(many.input.attributes[4]).toBe('+')
})

