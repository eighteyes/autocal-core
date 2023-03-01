import { Activity } from '../../types/activity';

/* Functions to apply to model objects */

export function sortActivityByWeight(acts: Activity[]) {
  // inplace sort
  return acts.sort((a: Activity, b: Activity) => {
    if (a.weight < b.weight) return 1;
    if (a.weight > b.weight) return -1;
    if (a.weight === b.weight) return 0;
  });
}
