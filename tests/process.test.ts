import { Activity } from '../src/types/activity';
import { Context } from '../src/types/context';
import { parseComplete } from '../src/parsers/parseComplete';
import { processGet, processMutate } from '../src/text';
import { ProcessGetOptions, ProcessMutateOptions } from '../src/types/process';
import * as input from './inputs';

describe('get - text processing', () => {
  test('Can process plan text into Contexts', () => {
    const r = processGet(input.contexts.actCtx);
    expect(r).toHaveLength(1);
  });

  test('Can get context names', () => {
    const opts: ProcessGetOptions = {
      type: 'context',
      format: 'array',
      lookup: 'display',
    };

    const r = processGet(input.contexts.many, opts);
    expect(r).toHaveLength(4);
  });

  test('Can lookup activity string array for a context id', () => {
    const opts: ProcessGetOptions = {
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
    const opts: ProcessGetOptions = {
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
    const opts: ProcessGetOptions = {
      type: 'activity',
      format: 'array2d',
      lookup: 'display',
    };

    const r = processGet(input.contexts.many, opts) as Activity[][];
    expect(r).toHaveLength(4);
    expect(r[0][0]).toBe('One');
  });

  test('Can get all activities', () => {
    const opts: ProcessGetOptions = {
      type: 'activity',
      format: 'array',
    };

    const r = processGet(input.contexts.many, opts) as Activity[];
    expect(r).toHaveLength(12);
    expect(r[0].input.content).toBe('One');
  });

  test('Can get nested array of contexts and activities, plan list', () => {
    const opts: ProcessGetOptions = {
      type: 'plan',
      format: 'array2d',
      lookup: 'display',
    };

    const r = processGet(input.contexts.many, opts) as Activity[][];
    expect(r).toHaveLength(4);
    expect(r[0][1]).toBe('One');
  });

  test('Can lookup context from id', () => {
    const opts: ProcessGetOptions = {
      type: 'context',
      format: 'object',
      filter: 'index',
      filterVal: 1,
    };
    const r = processGet(input.contexts.many, opts) as Context;
    expect(r.index).toBe(1);
  });
});

describe('mutate - text processing', () => {
  test('can add an empty context', () => {
    const opts: ProcessMutateOptions = {
      type: 'context',
      op: 'add',
      value: 'test context',
    };

    let plan = processMutate(input.contexts.many, opts);
    let r = parseComplete(plan);
    expect(r).toHaveLength(5);
  });
  test('can add an activity to a context', () => {
    const opts: ProcessMutateOptions = {
      type: 'activity',
      op: 'add',
      targetContextIndex: 1,
      value: 'test activity',
    };

    let plan = processMutate(input.contexts.many, opts);
    let r = parseComplete(plan);
    expect(r[1].activities).toHaveLength(4);
  });
  test('can remove an activity from a context', () => {
    const opts: ProcessMutateOptions = {
      type: 'activity',
      op: 'remove',
      targetContextIndex: 1,
      targetActivityIndex: 1,
    };

    let plan = processMutate(input.contexts.many, opts);
    let r = parseComplete(plan);
    expect(r[1].activities).toHaveLength(2);
  });
  test('can remove a context', () => {
    const opts: ProcessMutateOptions = {
      type: 'context',
      op: 'remove',
      targetContextIndex: 1,
    };

    let plan = processMutate(input.contexts.many, opts);
    let r = parseComplete(plan);
    expect(r).toHaveLength(3);
  });
});
