import { readFile } from "./read"
import { parseEvent, parseLine, parseTextIntoContextsAndEvents } from "./parse" 
var fileName = "examples/plan.acr"

let { contexts, events } = parseTextIntoContextsAndEvents(readFile(fileName));


// Output
console.log(events.length, 'contexts found')
// console.log(countAllEvents(contexts), 'events found')

for (let i = 0; i <= 1; i++) {
    let rInt = Math.round(Math.random() * events.length);
    try {
        console.log(rInt, events[rInt].content)
    } catch (e) {
        console.error(rInt, events[rInt], e)
    }
}
// console.log( "contexts", contexts)
