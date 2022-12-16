import { readFile } from './read';
import { parseComplete, selectActivitiesUsingWeights } from './models/contextFn';
import { Context } from './models/context';
import { Activity } from './models/activity';
import { doSelection } from './selection';

import config from '../src/config';

// point to TS in errors
require('source-map-support').install();

// whether we are running standalone or as a module
const isLocal = require.main === module;
const fileName = isLocal ? './examples/plan.acr' : module.path + '/../../examples/plan.acr';

// make some output from examples
if (isLocal) {
  let contexts: Context[] = parseComplete(readFile(fileName));

  let result = doSelection(contexts, 100);
  console.log('Output');
  result.forEach((act, i) => {
    if (i == 0) {
      console.log(act);
    }
    console.log(act.input.contextName, act.input.content, act.cyclicStrength, act.weight);
  });
}

// default to example
function select(text: string = readFile(fileName), cfg: object = config) {
  return doSelection(parseComplete(text));
}

function getContextNames(text: string = readFile(fileName), id: boolean = false) {
  let ctxs = parseComplete(text);

  return ctxs.map((c) => {
    if (id) {
      return [c.input.content, c.id];
    }
    return c.input.content;
  });
}

function getActivitiesForContext(text: string = readFile(fileName), contextId: string): Activity[] {
  let ctxs = parseComplete(text);

  return ctxs.filter((c) => {
    return c.id == contextId;
  })[0].activities;
}

function getActivityListForContext(text: string = readFile(fileName), contextId: string): string[] {
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

function getPlanListFromText(text: string = readFile(fileName)): string[][] {
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

export function defaultPlan(): string {
  return readFile(fileName);
}

import { addRawContext } from './raw';
export {
  select,
  getContextNames,
  getActivitiesForContext,
  getPlanListFromText,
  addRawContext,
  getActivityListForContext,
  Context,
};
