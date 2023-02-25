import { readFile } from './read';
import { parseComplete, selectActivitiesUsingWeights, renderContext } from './models/contextFn';
import { Context } from './types/context';
import { Activity } from './types/activity';
import { doSelection } from './selection';

import { processGet, processMutate } from './text';

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
  let matchingCtx = ctxs.filter((c) => {
    return c.index == contextId;
  })[0];

  if (matchingCtx) {
    return matchingCtx.activities;
  } else {
    // in case of empty context
    return [];
  }
}

// Text Processing End

export function defaultPlan(): string {
  console.log('Loading... ', fileName);

  return readFile(fileName);
}

import {
  lookupContextTextFromIndex,
  getContextNames,
  getPlanListFromText,
  getActivityListForContext,
  addActivityToContext,
} from './text';
import { addRawContext } from './raw';
import { Config } from './types/config';
export {
  processGet as get,
  processMutate as set,
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
