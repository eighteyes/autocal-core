import { readFile } from './read';
import { parseComplete, selectActivityUsingWeights } from './models/contextFn';
var fileName = 'examples/plan.acr';
import { Context } from './models/context';

let contexts: Context[] = parseComplete(readFile(fileName));

// Output
console.log(contexts.length, 'contexts found!!');
// console.log(countAllactivities(contexts), 'activities found')
let cons = selectActivityUsingWeights(contexts[0], 5);
cons.forEach((c) => {
  console.log(c.weight, c.content, c);
});
