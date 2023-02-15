import { processGet } from '../src/text';
import { ProcessOptions } from '../src/types/process';
import * as input from './inputs';

test('Can process plan text into Contexts', () => {
  const r = processGet(input.contexts.actCtx);
  expect(r).toHaveLength(1);
});

test('Can get context names', () => {
  const opts: ProcessOptions = {
    type: 'context',
    format: 'array',
    lookup: 'display',
  };

  const r = processGet(input.contexts.many, opts);
  expect(r).toHaveLength(4);
});

test('Can lookup activity string array for a context id', () => {
  const opts: ProcessOptions = {
    type: 'activity',
    format: 'array',
    lookup: 'display',
    filter: 'ctx-index',
    filterVal: 1,
  };

  const r = processGet(input.contexts.many, opts);
  expect(r).toHaveLength(3);
});
test.todo('Can lookup activity object array for a context id');
test.todo('Can get activity names in array');
test.todo('Can get all activities');
test.todo('Can get nested array of contexts and activities, plan list');
test.todo('Can lookup context from id');
