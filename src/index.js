import { read as readFile } from "./read.js"
import * as defaults from "./defaults.js"

var fileName = "examples/plan.acr"
var orderingAlgo = "^+"
let contextraws = []
let contexts=[]


const output = readFile(fileName)

// break input into context blocks
const contextStrings = output.split('\n\n')
contextStrings.forEach((c)=>{
    // trim in case of extra whitespace btwn contexts
    contextraws.push(c.trim())
})

contextraws.forEach((c)=>{
    let ctx = { events : [] }
    // turn txt into array
    c = c.split('\n')
    // shift mutates c, divide our raw inputs
    ctx.contextRaw = c.shift()
    ctx.eventsRaw = c;

    ctx.name = ctx.contextRaw.replace(defaults.regex. contextHashMatch, '')
    contexts.push(ctx)
})
console.log( "contexts", contexts)
