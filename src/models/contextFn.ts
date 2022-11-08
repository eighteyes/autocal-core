import {regex, startWeight, attributeList } from '../defaults'
import { Context } from './context'

export function parseTextIntoContexts(input:string) {
    let contextraws: string[] = []
    let contexts: Context[] = []

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
        let name: string = line.shift().replace(regex.contextHashMatch, '')

        let ctx: Context = {
            name,
            activities: [],
            raw: line.join('\n')
        }

        contexts.push(ctx)
    })
    return contexts
}

export function processContext(ctx:Context){
    // cycle through every event in the context
    ctx.raw.split('\n').forEach((ln) => {
        const e: Activity = parseLine(ln)
        ctx.activities.push(e)
    })

    // after all lines are parsed 
    generateReferences(ctx);
    generateWeights(ctx);
}


export function parseLine(ln: string): Activity {
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
    let attributeMatches = ln.match(regex.attributes)
    
    if ( attributeMatches ){
        attributeMatches[0].split('').forEach((e)=>{
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

export function generateReferences(ctx: Context) {
    // pull list of content from context
    let contents: string[] = ctx.activities.map((c) => {
        c.reference = c.content.replace(regex.lettersOnly, '').slice(0, 10).toLowerCase();
        return c.reference;
    })

}

export function generateWeights(ctx: Context) {
    ctx.activities.forEach((act)=>{
        act.weight = Math.min(Math.floor(act.integerWeight/100), 1)    
    })
}

export function selectTopSortedActivity(ctx: Context, count:number = 1){
    return sortActivityWeights(ctx).slice(0, count)                   
}

export function sortActivityWeights(ctx:Context){
    // inplace sort
    return ctx.activities.sort(
        (a:Activity,b:Activity) => {
            if (a.weight < b.weight) return 1;
            if (a.weight > b.weight) return -1;
            if (a.weight === b.weight) return 0;
        }
    )
}

export function selectActivityUsingWeights(ctx: Context, count:number = 1) : Activity[]{
    let input : Activity[] = sortActivityWeights(ctx);
    let output : Activity[] = [];

    for (let i = 0; i < input.length; i++) {
        const element = input[i];
        // crux of selection, use weight as % chance
        if ( Math.random() > element.weight ){
            output.push( element )
        }
        if ( output.length >= count ){
            break;
        }
    }

    return output
}