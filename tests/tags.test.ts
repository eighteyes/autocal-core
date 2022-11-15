import { parseLine } from '../src/models/contextFn';
import { tags } from './inputs';

test('an event tag can be parsed', () => {
  let e = parseLine(tags.single);
  expect(e.input.tags).toContain('yardwork');
});

test('many event tags can be parsed', () => {
  let e = parseLine(tags.multiple);
  expect(e.input.tags).toContain('yardwork');
  expect(e.input.tags).toContain('hardwork');
  expect(e.input.tags).toHaveLength(2);
});
