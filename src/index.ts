import { readFile } from './read';
import { parseComplete } from './parsers/parseComplete';
import { Context } from './types/context';
import { Activity } from './types/activity';
import { doSelection } from './selection';
import { processGet, processMutate } from './text';
import { select, selectAlgo, selectOrdered, selectRandom } from './selection';

// point to TS in errors
require('source-map-support').install();

// whether we are running standalone or as a module
const isLocal = require.main === module;
let fileName = isLocal ? './examples/plan.acr' : module.path + '/../../examples/simple.acr';

// make some output from examples for basic running
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

export function defaultPlan(): string {
  console.log('Loading... ', fileName);
  return readFile(fileName);
}

export { processGet as get, processMutate as set, select, selectRandom, selectAlgo, selectOrdered, Context, Activity };
