//// TEXT PROCESSING STARTS

import { Activity } from './models/activity';
import { Context } from './models/context';
import { parseComplete, renderContext } from './models/contextFn';
import { readFile } from './read';
import { ProcessOptions } from './types/process';

// whether we are running standalone or as a module
const isLocal = require.main === module;
let fileName = isLocal ? './examples/plan.acr' : module.path + '/../../examples/simple.acr';

/*
 * processGet is exposed externally to the core module
 * @param plan = raw text of plan
 * @param opts.type = what entity to lookup
 * @param opts.lookup = what information to return
 * @param opts.format = how to format the return information
 * @param opts.filter = what to lookup on, id or name
 * @param opts.filterVal = what is the id or name?
 * @returns
 */
export function processGet(plan: string, opts?: ProcessOptions) {
  let ctxs: Context[] = parseComplete(plan);

  let resp, values;

  // if no opts passed, return context objects
  if (!opts) {
    return ctxs;
  }

  // extract
  if (opts.type === 'context') {
    values = ctxs;
  } else if (opts?.type === 'activity') {
    if (opts.filter === 'ctx-index') {
      ctxs = ctxs.filter((v) => {
        return v.index === opts.filterVal;
      });
    }
    values = ctxs.map((c) => {
      return c.activities;
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
  }

  // filter
  if (opts.lookup === 'display') {
    resp = values.map((v) => {
      if (Array.isArray(v)) {
        return v.map((v1) => {
          return v1.input.content;
        });
      }
      return v.input.content;
    });
  } else {
    resp = values;
  }

  return resp;
}

// lookup names by id
// return only context contents, or content with index for lookup on selection
export function getContextNames(
  text: string = readFile(fileName),
  index: boolean = false
): (string | (string | number)[])[] {
  let ctxs = parseComplete(text);

  const r = ctxs.map((c) => {
    if (index) {
      return [c.input.content, c.index];
    }
    return c.input.content;
  });

  return r;
}

export function lookupContextTextFromIndex(text: string = readFile(fileName), index: number): string {
  // multiline between ctx
  const ctxs = text.split('\n\n');

  return ctxs[index] || '';
}

// exposed / return rendered string from plan string input
export function addActivityToContext(text: string, ctx: number, new_activity: string): string {
  let ctxs = parseComplete(text);
  let resp = '';
  ctxs.forEach((c) => {
    resp += renderContext(c);
    if (c.index == ctx) {
      resp += new_activity + '\n';
    }
    resp += '\n';
  });
  return resp;
}

// return act list for a context - useful for menus
export function getActivityListForContext(text: string = readFile(fileName), contextId: string): string[] {
  let ctxs: Context[] = parseComplete(text);

  let output: string[] = ctxs.map((c: Context) => {
    if (c.index == parseInt(contextId)) {
      return c.activities.map((a: Activity) => {
        return a.input.content;
      });
    }
  })[0];

  return output;
}

// return nested array of context content
export function getPlanListFromText(text: string = readFile(fileName)): string[][] {
  let ctxs = parseComplete(text);

  let out: string[][] = [];

  ctxs.forEach((ctx) => {
    const a: string[] = [
      ctx.input.content,
      ...ctx.activities.map((act) => {
        return act.input.content;
      }),
    ];
    out.push(a);
  });

  return out;
}
