//// TEXT PROCESSING STARTS

import { Activity } from './types/activity';
import { Context } from './types/context';
import { renderContext } from './models/context/render';
import { parseComplete } from './parsers/parseComplete';
// whether we are running standalone or as a module
const isLocal = require.main === module;
export let fileName = isLocal ? './examples/plan.acr' : module.path + '/../../examples/simple.acr';

export function lookupContextTextFromIndex(text: string, index: number): string {
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
export function getActivityListForContext(text: string, contextId: string): string[] {
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
export function getPlanListFromText(text: string): string[][] {
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
