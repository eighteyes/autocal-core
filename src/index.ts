import { readFile } from "./read.js"
import { parseEvent, parseLine } from "./parse.js"
import * as defaults from "./defaults.js"

var fileName = "examples/plan.acr"
var orderingAlgo = "^+"
let contextraws: string[] = []
let contexts: Context[] =[]
let events: CalEvent[] = []

const output = readFile(fileName)

// break input into context blocks
const contextStrings = output.split('\n\n')
contextStrings.forEach((c:string)=>{
    // trim in case of extra whitespace btwn contexts
    contextraws.push(c.trim())
})

contextraws.forEach((c)=>{
    // split along lines
    let line = c.split('\n')
    // shift mutates array
    let raw : string = line.shift()

    let ctx : Context = { 
        name: raw.replace(defaults.regex. contextHashMatch, ''),
        events: [],
        raw
    }
    
    // cycle through every event in the context
    line.forEach((ln) =>   {
        ctx.events.push( parseLine(ln, ctx) )
        events.push( parseLine(ln, ctx))
    })

    contexts.push(ctx)
})

console.log(events.length, 'events found')
for ( let i = 0; i <= 1; i++){
    let rInt = Math.round(Math.random()*events.length);
    console.log( rInt, events[rInt].content )
}
// console.log( "contexts", contexts)
