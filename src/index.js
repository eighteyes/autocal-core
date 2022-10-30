import { read as readFile } from "./read.js"

var fileName = "examples/plan.acr"

const output = readFile(fileName)

console.log(output)
