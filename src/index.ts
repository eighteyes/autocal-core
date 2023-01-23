import { readFile } from './read';
import { parseComplete, selectActivitiesUsingWeights, renderContext } from './models/contextFn';
import { Context } from './models/context';
import { Activity } from './models/activity';
import { doSelection } from './selection';

import config from '../src/config';

// point to TS in errors
require('source-map-support').install();

// whether we are running standalone or as a module
const isLocal = require.main === module;
let fileName = isLocal ? './examples/plan.acr' : module.path + '/../../examples/simple.acr';

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

// getAll

// default to example
function select(text: string = readFile(fileName), count = 1, cfg: object = config) {
  return doSelection(parseComplete(text), count);
}

function selectAlgo(text: string = readFile(fileName), count = 1, cfg: Config = config) {
  cfg = { ...config, ...cfg, ...{ useAlgorithm: true } };
  return doSelection(parseComplete(text), count, cfg);
}

function selectOrdered(text: string = readFile(fileName), count = 1, cfg: Config = config) {
  // override defaults
  cfg = { ...config, ...cfg, ...{ useAlgorithm: false, selectionType: 'ordered' } };
  return doSelection(parseComplete(text), count, cfg);
}

function selectRandom(text: string = readFile(fileName), count = 1, cfg: Config = config) {
  // override defaults
  cfg = { ...config, ...cfg, ...{ useAlgorithm: false, selectionType: 'random' } };
  return doSelection(parseComplete(text), count, cfg);
}

// get all the Activity objects
function getActivitiesOnly(plan: string = readFile(fileName)) {
  let ctxs = parseComplete(plan);

  return ctxs.map((c) => {
    return c.activities;
  });
}

// pull Activity objects for a context
function getActivitiesForContext(text: string = readFile(fileName), contextId: number): Activity[] {
  let ctxs = parseComplete(text);
  return ctxs.filter((c) => {
    return c.index == contextId;
  })[0].activities;
}

//// TEXT PROCESSING STARTS

// lookup names by id
// return only context contents, or content with index for lookup on selection
function getContextNames(text: string = readFile(fileName), index: boolean = false): (string | (string | number)[])[] {
  let ctxs = parseComplete(text);

  const r = ctxs.map((c) => {
    if (index) {
      return [c.input.content, c.index];
    }
    return c.input.content;
  });

  return r;
}

function lookupContextTextFromIndex(text: string = readFile(fileName), index: number): string {
  // multiline between ctx
  const ctxs = text.split('\n\n');

  return ctxs[index] || '';
}

// exposed / return rendered string from plan string input
function addActivityToContext(text: string, ctx: number, new_activity: string): string {
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

// return nested array of context content
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

// Text Processing End

export function defaultPlan(): string {
  console.log('Loading... ', fileName);

  return readFile(fileName);
}

import { addRawContext } from './raw';
import { Config } from './types/config';
export {
  lookupContextTextFromIndex,
  select,
  selectRandom,
  selectAlgo,
  selectOrdered,
  getContextNames,
  getActivitiesOnly,
  getActivitiesForContext,
  getPlanListFromText,
  addRawContext,
  getActivityListForContext,
  addActivityToContext,
  Context,
  Activity,
};
