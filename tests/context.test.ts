import * as renderContext from '../src/models/context/renderContext';
import * as findActivitiesByTags from '../src/models/context/findActivitiesByTags';
import * as parseComplete from '../src/parsers/parseComplete';
import * as inputs from './inputs';

test('can findActivitiesByTag in a context', () => {
  let ctxs = parseComplete.parseComplete(inputs.tags.ctxMultiple)[0];
  expect(findActivitiesByTags.findActivitiesByTag([ctxs], 'tag1')).toHaveLength(1);
  expect(findActivitiesByTags.findActivitiesByTag([ctxs], 'tag2')).toHaveLength(2);
});

test('can findActivitiesByTags in a context', () => {
  let ctxs = parseComplete.parseComplete(inputs.tags.ctxMultiple)[0];
  expect(findActivitiesByTags.findActivitiesByTags([ctxs], ['tag1', 'tag2'])).toHaveLength(2);
});

test('apply cyclics to context inputs', () => {
  let ctxs = parseComplete.parseComplete(inputs.cyclics.plusContext);
  expect(ctxs[0].input.cyclics).toHaveLength(1);
});

test('apply attributes from context to activities', () => {
  let ctxs = parseComplete.parseComplete(inputs.contexts.actCtx);
  expect(ctxs[0].activities[0].input.attributes).toHaveLength(2);
  expect(ctxs[0].activities[1].input.attributes).toHaveLength(2);
  expect(ctxs[0].activities[0].input.cyclics).toHaveLength(2);
});
test('apply cyclics from context to activities', () => {
  let ctxs = parseComplete.parseComplete(inputs.cyclics.plusContext);
  expect(ctxs[0].activities[0].input.cyclics).toHaveLength(1);
});

test.todo('apply dependencies from context to activities');

test('can render a context', () => {
  const c = renderContext.renderContext(parseComplete.parseComplete(inputs.contexts.actCtx)[0]);
});
