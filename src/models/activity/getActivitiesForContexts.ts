import { Context } from '../../types/context';
import { Activity } from '../../types/activity';

// return list of activities only
export function getActivitiesForContexts(ctxs: Context[]): Activity[] {
  let acts: Activity[] = [];
  for (const c of ctxs) {
    acts.push(...c.activities);
  }
  return acts;
}
