import { Activity } from '../../types/activity';
import { Context } from '../../types/context';

export function getDependencyTags(act: Activity | Context): string[] {
  return act.links
    .map((l) => {
      return l.tags;
    })
    .flat();
}
