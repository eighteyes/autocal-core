import { Context } from '../../types/context';
import { parseComplete } from '../../parsers/parseComplete';
import { ProcessGetOptions } from '../../types/process';

/*
 * processGet is exposed externally from the core module. within is a variety of collection options.
 * note, not all possible permutations are implemented yet, just the ones we need. surely this will undergo revision.
* by default, all Actitiies are returned if no context is passed 
* @param plan = raw text of plan
 * @param opts.type = what entity to lookup
 * @param opts.lookup = what information to return
 * @param opts.format = how to format the return information
 * @param opts.filter = what to lookup on, id or name
 * @param opts.filterVal = what is the id or name?
 * @returns ProcessGetOutput : having trouble with TS for this one
 */

export function processGet(plan: string, opts?: ProcessGetOptions) {
  let ctxs: Context[] = parseComplete(plan);

  let resp, values;

  // if no opts passed, return context objects
  if (!opts) {
    return ctxs;
  }

  // extract
  if (opts.type === 'context') {
    values = ctxs;
    if (opts.filter === 'index') {
      values = ctxs.filter((v) => {
        return v.index === opts.filterVal;
      });
    }
  } else if (opts?.type === 'activity') {
    if (opts.filter === 'ctx-index') {
      ctxs = ctxs.filter((v) => {
        return v.index === opts.filterVal;
      });
    }
    values = ctxs.map((c) => {
      return c.activities;
    });
  } else if (opts.type === 'plan') {
    // build a plan list
    values = [] as string[];

    ctxs.forEach((ctx) => {
      const a: object[] = [ctx, ...ctx.activities];
      values.push(a);
    });
  }

  // transform
  if (opts?.format == 'array') {
    if (!Array.isArray(values)) {
      throw new Error('Invalid Process');
    }
    // flatten if nested
    if (Array.isArray(values[0])) {
      values = values.flat();
    }
  } else if (opts.format === 'array2d') {
    if (!Array.isArray(values[0])) {
      throw new Error('Invalid Process');
    }
  } else if (opts.format === 'object') {
    if (Array.isArray(values)) {
      values = values[0];
    }
  }

  // filter
  if (opts.lookup === 'display') {
    if (Array.isArray(values)) {
      resp = values.map((v) => {
        if (Array.isArray(v)) {
          return v.map((v1) => {
            return v1.input.content;
          });
        }
        if (typeof v == 'string') {
          return v;
        } else {
          return v.input.content;
        }
      });
    } else {
      if (typeof values == 'string') {
        resp = values;
      } else {
        // if it's an object
        resp = values.input.content;
      }
    }
  } else {
    resp = values;
  }

  return resp;
}
