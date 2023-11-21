import config from '../config';
import { Activity } from '../types/activity';
import { canBeSelected } from './canBeSelected';
import { sortActivityByWeight } from '../models/activity/sortActivityByWeight';

export function selectActivitiesUsingWeights(acts: Activity[], count: number = 1): Activity[] {
  let input: Activity[] = sortActivityByWeight(acts);
  let output: Activity[] = [];

  for (let i = 0; i < input.length; i++) {
    const act = input[i];
    // no randomness
    if (!config.randomSelection && canBeSelected(act)) {
      act.selected = true;
      output.push(act)
    } else if (config.randomSelection && canBeSelected(act) && Math.random() > act.weight) {
      // crux of selection, use weight as % chance
      //so we don't reselect
      act.selected = true;
      output.push(act);
    }
    if (output.length >= count) {
      break;
    }
  }

  return output;
}
