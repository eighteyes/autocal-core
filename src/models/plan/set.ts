import { Context } from '../../types/context';
import { parseTextIntoContexts } from '../../parsers/parseTextIntoContexts';
import { parseComplete } from '../../parsers/parseComplete';
import { parseLine } from '../../parsers/parseLine';
import { ProcessMutateOptions } from '../../types/process';
import { renderPlan } from './render';

/*
*
// mutate
/**
 * Return a processed plan. Centralizing this function here.
 * input: planlist
 * output: planlist
 */

export function processMutate(plan: string, opts: ProcessMutateOptions) {
  let ctxs: Context[] = parseComplete(plan);

  let values, resp;

  if (opts.op == 'add') {
    if (opts.type == 'context') {
      if (opts.value[0] !== '#') {
        opts.value = '# ' + opts.value;
      }
      const addCtx = parseTextIntoContexts(opts.value);
      ctxs.push(...addCtx);
    } else if (opts.type == 'activity') {
      // add activity to context
      const addAct = parseLine(opts.value);
      ctxs[opts.targetContextIndex].activities.push(addAct);
    }
  } else if (opts.op == 'remove') {
    if (opts.type === 'activity') {
      ctxs[opts.targetContextIndex].activities.splice(opts.targetActivityIndex, 1);
    } else if (opts.type === 'context') {
      ctxs.splice(opts.targetContextIndex, 1);
    }
  } else if (opts.op == 'replace') {
    if (opts.type === 'activity') {
      ctxs[opts.targetContextIndex].activities[opts.targetActivityIndex] = parseLine(opts.value);
    } else {
      let ctx: Context = ctxs[opts.targetContextIndex];
      // clone
      let acts = [...ctx.activities];

      let newCtx = parseTextIntoContexts('# ' + opts.value)[0];
      newCtx.activities = acts;

      ctxs[opts.targetContextIndex] = newCtx;
    }
  }

  resp = renderPlan(ctxs);
  return resp;
}
