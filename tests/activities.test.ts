import { parseLine } from '../src/models/contextFn';
import { content, deps } from './inputs';
import { Activity } from '../src/models/activity';
import { getDependencyTags } from '../src/models/activityFn';

test('Can split content', () => {
  let e = parseLine(content.splitBasic);
  expect(e.content).toBe('Call Marcelo RE : Landing Page');
  e = parseLine(content.splitComplex);
  expect(e.content).toBe('Presents 4 Judy & Mark! // (and f)');
});

test.skip('Can generate unique references from similiar strings', () => {});
