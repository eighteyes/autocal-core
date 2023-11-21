import { parseLine } from '../src/parsers/parseLine';
import { content, deps } from './inputs';
import { render } from '../src/models/activity/render';

test('Can split content', () => {
  let e = parseLine(content.splitBasic);
  expect(e.input.content).toBe('Call Marcelo RE : Landing Page');
  e = parseLine(content.splitComplex);
  expect(e.input.content).toBe('Presents 4 Judy & Mark');
});

test.skip('Can render content', () => {
let e = parseLine(content.splitBasic);
expect(render(e)).toBe(12);
});
// test.todo('Can generate unique references from similiar strings', () => {});
