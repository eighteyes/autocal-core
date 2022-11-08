import {regex} from '../defaults'
import { Context } from './context'

export function generateReferences(contexts: Context[]) {

    contexts.forEach((ctx) => {
        // pull list of content from context
        let contents: string[] = ctx.activities.map((c) => {
            c.reference = c.content.replace(regex.lettersOnly, '').slice(0, 10).toLowerCase();
            return c.reference;
        })
    })
}

export function generateWeights(contexts: Context[]) {
    contexts.forEach((c)=>{
        c.activities.forEach((act)=>{
            act.weight = Math.min(Math.floor(act.integerWeight/100), 1)    
        })
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