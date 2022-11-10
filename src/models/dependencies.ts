import { Context } from "./context";
import { findActivitiesByTags } from "./contextFn";
import { addDependentActivity } from "./activityFn";
import { Activity, ActivityDependencies } from "./activity";

export function generateDependencies(ctx: Context): Context {
  ctx.activities.forEach((act, i) => {
    // link implicit
    if (act.dependencies.attachNext == ">") {
      addDependentActivity(act, ctx.activities[i + 1]);
    }

    if (act.dependencies.attachNext == "<") {
      addDependentActivity(act, ctx.activities[i + 1], true);
    }

    if (act.dependencies.attachNext == ">>") {
      addDependentActivity(act, ctx.activities[i + 1], false, true);
    }

    if (act.dependencies.attachNext == "<<") {
      addDependentActivity(act, ctx.activities[i + 1], true, true);
    }

    // link downstream
    let matchingActs: Activity[] = findActivitiesByTags(
      ctx,
      act.dependencies.downstreamTags
    );
    matchingActs.forEach((ma) => {
      addDependentActivity(act, ma);
    });

    // link upstream
    matchingActs = findActivitiesByTags(ctx, act.dependencies.upstreamTags);
    matchingActs.forEach((ma) => {
      addDependentActivity(act, ma, true);
    });
  });

  return ctx;
}
