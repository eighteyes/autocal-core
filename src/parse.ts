import { regex, attributeList, startWeight } from './defaults'
import { Weight } from './models/weight'

export function parseEvent(ln: string, ctx: Context) {

}

export function parseTextIntoContextsAndEvents(input:string) {
    let contextraws: string[] = []
    let contexts: Context[] = []
    let events: Activity[] = []

    // break input into context blocks
    const contextStrings = input.split('\n\n')
    contextStrings.forEach((c: string) => {
        // trim in case of extra whitespace btwn contexts
        contextraws.push(c.trim())
    })

    contextraws.forEach((c) => {
        // split along lines
        let line = c.split('\n')
        // shift mutates array
        let raw: string = line.shift()

        let ctx: Context = {
            name: raw.replace(regex.contextHashMatch, ''),
            events: [],
            raw
        }

        // cycle through every event in the context
        line.forEach((ln) => {
            const e: Activity = parseLine(ln)
            ctx.events.push(e)
            events.push(e)
        })

        contexts.push(ctx)
    })
    return { contexts, events }
}

export function parseLine(ln: string, ctx?: Context): Activity {
    let durations: string[] = []; 
    let tags: string[] = []; 
    let attributes: string[] = []; 
    let integerWeight = startWeight;

    let done = (ln[0] == 'x')
    if (done) {
        ln = ln.replace('x ', '')
    }

    // start with length, so we have something in place in case of only content
    let splitPoints = [ln.length];
    
    // add effect split points
    let actionMatches = ln.match(regex.attributes)
    
    if ( actionMatches ){
        actionMatches[0].split('').forEach((e)=>{
            splitPoints.push( ln.indexOf(e) )
            attributes.push(e)
            let eObj = attributeList.filter((e1)=>{ return e1.symbol == e })[0]
            integerWeight += eObj.weight;           
        })
    }
    
    // cycle through all meta info indices
    const durationMatches = ln.match(regex.duration);
    if ( durationMatches ){
        durationMatches.forEach((d)=>{
            splitPoints.push( ln.indexOf(d) )
            durations.push(d)
        })
    }

    const tagMatches = ln.match(regex.tag)
    if ( tagMatches ){
        tagMatches.forEach((t)=>{
            splitPoints.push( ln.indexOf(t) )
            tags.push(t.slice(1))
        })
    }

    let splitIndex = Math.min(...splitPoints)
    let content = ln.slice(0, splitIndex).trim()


    let raw = {
        meta: ln.slice(splitIndex),
        metas: ln.slice(splitIndex).split(' ')
    }

    return { content, raw, durations, tags, attributes, done, integerWeight }

}


function parseTokens(ln) {

}
