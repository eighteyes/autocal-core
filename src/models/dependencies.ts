import { Context } from './context'
import { findActivitiesByTags } from './contextFn';
import { addDependentActivity } from './activityFn'

export function generateDependencies(ctx: Context) : Context {
    ctx.activities.forEach((act, i) => {
        // link implicit
        if ( act.attachNext == '>') {
            addDependentActivity(act, ctx.activities[i+1])
        }
         
        if ( act.attachNext == '<'){
            addDependentActivity(act, ctx.activities[i+1], true)
        }
            
        // link downstream
        let matchingActs : Activity[] = findActivitiesByTags(ctx, act.downstreamTags)
        matchingActs.forEach((ma) => {
             addDependentActivity(act,ma);
        })
        
        // link upstream
        matchingActs = findActivitiesByTags(ctx, act.upstreamTags)
        matchingActs.forEach((ma) => {
            addDependentActivity(act, ma, true)
        })
    });

    return ctx;
}