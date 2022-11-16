import * as fn from '../src/models/contextFn';
import * as inputs from './inputs';

test('can findActivitiesByTag in a context', () => {
  let ctxs = fn.parseComplete(inputs.tags.ctxMultiple)[0];
  expect(fn.findActivitiesByTag(ctxs, 'tag1')).toHaveLength(1);
  expect(fn.findActivitiesByTag(ctxs, 'tag2')).toHaveLength(2);
});

test('can findActivitiesByTags in a context', () => {
  let ctxs = fn.parseComplete(inputs.tags.ctxMultiple)[0];
  expect(fn.findActivitiesByTags(ctxs, ['tag1', 'tag2'])).toHaveLength(2);
});

test('should apply cyclics to context inputs', () => {
  let ctxs = fn.parseComplete(inputs.cyclics.plusContext);
  expect(ctxs[0].input.cyclics).toHaveLength(1);
});

test('should apply attributes from context to activities', () => {
  let ctxs = fn.parseComplete(inputs.contexts.actCtx);
  expect(ctxs[0].activities[0].input.attributes).toHaveLength(2);
  expect(ctxs[0].activities[1].input.attributes).toHaveLength(2);
  expect(ctxs[0].activities[0].input.cyclics).toHaveLength(2);
});
test.todo('should apply cyclics from context to activities');
test.todo('should apply dependencies from context to activities');
