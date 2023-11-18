import { Context } from '../../types/context';
import { Activity, ActivityLink } from '../../types/activity';

/**
 * adds blocked: true to any dependency activity
 * where activity.links[].required = true
 * >> and << 
 * call this after dependencies are hydrated with refernce
 * @param ctxs : Context[] with processed activities 
 * @returns ctxs
 */

export function findBlockers(ctxs: Context[]): Context[] {
  ctxs.forEach((ctx) => {
    ctx.activities.forEach((act: Activity) => {
      act.links.forEach((l: ActivityLink) => {
        if (l.required) {
          if (!l.reference) {
            console.error('Tagged dependency', l.tags, 'has no reference.');
            return;
          }
          let ref = l.reference;
          // expire anything downstream not available
          // availability is determined as part of selection
          if (!act.done && l.downstream) {
            ref.blocked = true;
          } else {
            ref.blocked = false;
          }
        }
      });
    });
  });

  return ctxs;
}
