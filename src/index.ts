import { readFile } from "./read"
import { parseTextIntoContextsAndActivities } from "./parse" 
var fileName = "examples/plan.acr"
import { Context } from "./models/context";

let contexts: Context[]  = parseTextIntoContextsAndActivities(readFile(fileName));


// Output
console.log(contexts.length, 'contexts found!!')
// console.log(countAllactivities(contexts), 'activities found')
