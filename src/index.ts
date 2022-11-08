import { readFile } from "./read"
import { parseTextIntoContexts, selectActivityUsingWeights } from "./models/contextFn" 
var fileName = "examples/plan.acr"
import { Context } from "./models/context";
import { processContext } from "./models/contextFn"

let contexts: Context[]  = parseTextIntoContexts(
    readFile(fileName)
);

contexts.forEach((c)=>processContext(c))

// Output
console.log(contexts.length, 'contexts found!!')
// console.log(countAllactivities(contexts), 'activities found')
let cons = selectActivityUsingWeights(contexts[0], 5)
cons.forEach((c)=>{
    console.log(c.weight, c.content);
})