import * as fs from "fs"

function readFile ( file ) {
    const input = fs.readFileSync( file, { encoding: "utf8" })
    return input
}
export {
    readFile
}