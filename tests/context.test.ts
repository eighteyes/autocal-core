import * as renderContext from '../src/models/context/render';
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

test('apply attributes from context to activities', () => {
  let ctxs = parseComplete.parseComplete(inputs.contexts.actCtx);
  expect(ctxs[0].activities[0].input.attributes).toHaveLength(4);
  expect(ctxs[0].activities[1].input.attributes).toHaveLength(4);
});
test('apply cyclics from context to activities', () => {
  let ctxs = parseComplete.parseComplete(inputs.cyclics.plusContext);
});

test.todo('apply dependencies from context to activities');

test('can store context content under input.content', () => {
  let ctxs = parseComplete.parseComplete(inputs.contexts.basic);
  expect(ctxs[0].input.content).toBe('Context');
  
})

test('can render a context', () => {
  const c = renderContext.renderContext(parseComplete.parseComplete(inputs.contexts.actCtx)[0]);
});
