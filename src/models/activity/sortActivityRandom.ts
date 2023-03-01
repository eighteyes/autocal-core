import { Activity } from '../../types/activity';

export function sortActivityRandom(acts: Activity[]) {
  return acts.sort((a: Activity, b: Activity) => {
    const r = Math.random();
    if (r < 0.5) return 1;
    if (r > 0.5) return -1;
    if (r === 0.5) return 0;
  });
}
