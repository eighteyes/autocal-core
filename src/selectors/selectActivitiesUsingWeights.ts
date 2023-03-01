import config from '../config';
import { Activity } from '../types/activity';
import { canBeSelected } from './canBeSelected';
import { sortActivityByWeight } from '../models/activity/sortActivityByWeight';

export function selectActivitiesUsingWeights(acts: Activity[], count: number = 1): Activity[] {
  let input: Activity[] = sortActivityByWeight(acts);
  let output: Activity[] = [];

  for (let i = 0; i < input.length; i++) {
    const act = input[i];
    // crux of selection, use weight as % chance
    if (config.randomSelection && canBeSelected(act) && Math.random() > act.weight) {
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
