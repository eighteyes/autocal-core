import { Activity } from '../src/models/activity';
import { Context } from '../src/models/context';
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

test('Can lookup activity object array for a context id', () => {
  const opts: ProcessOptions = {
    type: 'activity',
    format: 'array',
    filter: 'ctx-index',
    filterVal: 1,
  };

  const r = processGet(input.contexts.many, opts) as Activity[];
  expect(r).toHaveLength(3);
  expect(r[0].ctxIndex).toBe(1);
});

test('Can get activity names in array', () => {
  const opts: ProcessOptions = {
    type: 'activity',
    format: 'array2d',
    lookup: 'display',
  };

  const r = processGet(input.contexts.many, opts) as Activity[][];
  expect(r).toHaveLength(4);
  expect(r[0][0]).toBe('One');
});

test('Can get all activities', () => {
  const opts: ProcessOptions = {
    type: 'activity',
    format: 'array',
  };

  const r = processGet(input.contexts.many, opts) as Activity[];
  expect(r).toHaveLength(12);
  expect(r[0].input.content).toBe('One');
});

test('Can get nested array of contexts and activities, plan list', () => {
  const opts: ProcessOptions = {
    type: 'plan',
    format: 'array2d',
    lookup: 'display',
  };

  const r = processGet(input.contexts.many, opts) as Activity[][];
  expect(r).toHaveLength(4);
  expect(r[0][1]).toBe('One');
});

test('Can lookup context from id', () => {
  const opts: ProcessOptions = {
    type: 'context',
    format: 'object',
    filter: 'id',
    filterVal: 1,
  };

  const r = processGet(input.contexts.many, opts) as Context;
  expect(r.activities).toHaveLength(3);
  expect(r.name).toBe('Context');
});
