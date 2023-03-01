import { Activity } from '../types/activity';

// Used during selection

export function canBeSelected(act: Activity): boolean {
  return !act.done && !act.blocked && !act.selected && act.available;
}
