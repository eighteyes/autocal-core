import { Context } from '../../types/context';
import { Activity } from '../../types/activity';

// look through all contexts for activities which match tags

export function findActivitiesByTags(ctxs: Context[], tags: string[]): Activity[] {
  let acts: Activity[] = [];

  tags.forEach((t) => {
    let matchActs: Activity[] = findActivitiesByTag(ctxs, t);
    matchActs.forEach((m) => {
      // don't insert dupes
      if (acts.indexOf(m) === -1) {
        acts.push(m);
      }
    });
  });

  return acts;
}
// look through all contexts to return matching activities for single tag

export function findActivitiesByTag(ctxs: Context[], tagName: string): Activity[] {
  let acts: Activity[] = [];

  acts = ctxs
    .map((ctx) => {
      return ctx.activities.filter((a) => {
        return a.input.tags.includes(tagName);
      });
    })
    .flat();

  return acts;
}
