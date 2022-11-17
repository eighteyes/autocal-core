import { readFile } from './read';
import {
  parseComplete,
  selectActivitiesUsingWeights,
} from './models/contextFn';
var fileName = 'examples/plan.acr';
import { Context } from './models/context';
import { doSelection } from './selection';

// point to TS in errors
require('source-map-support').install();

let contexts: Context[] = parseComplete(readFile(fileName));

let result = doSelection(contexts, 5);
console.log('Output');
result.forEach((act) => {
  console.log(act.input.content);
});
