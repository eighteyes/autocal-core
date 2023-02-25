import { Context } from '../types/context';
import { findActivitiesByTags } from './contextFn';
import { addDependentActivity, getDependencyTags } from './activityFn';
import { Activity, ActivityLink } from '../types/activity';
import { makeTestRef } from '../../tests/utils';

/** Processes a context to add dependency objects to contained activities
 * Dependencies are provided via following tags and implicitly. This function deals with
 * downstream/upstream dependencies which are targeted. The original activity has it's dependency generated on parse.
 */
export function generateDependencies(ctxs: Context[]): Context[] {
  ctxs.forEach((ctx) => {
    // cycle through activities for this context
    ctx.activities.forEach((act, i) => {
      // start here, tagged links were supplied earlier and have not been supplied with refs yet
      if (act.links.length !== 0) {
        // dep activities for all the linked tags need to backlink
        act.links.forEach((link: ActivityLink) => {
          // in case links have been set up by a prior act
          if (link.hasOwnProperty('reference')) {
            return;
          }

          // look up activities by tag to use as dependencies for this activity
          if (link.hasOwnProperty('tags') && link.tags.length !== 0) {
            let matchingActivities: Activity[] = findActivitiesByTags(ctxs, link.tags);
            matchingActivities.forEach((ma: Activity) => {
              let linkObj: ActivityLink = {
                type: 'dependency-tagged',
                // links to this act
                reference: act,
                upstream: !link.upstream,
                downstream: link.downstream,
                // should overlap with ma.tags
                tags: link.tags,
                required: link.required,
              };

              // dependency reference points towards linked Activity
              ma.links.push(linkObj);

              // update act link with ref to dependent act
              link.reference = ma;
              link.type = 'dependency-tagging';
            });
          }
        });
      }

      // link implicit references where > terminates the activity line
      if (act.attachNext == '>') {
        addDependentActivity(act, ctx.activities[i + 1]);
      }

      if (act.attachNext == '<') {
        addDependentActivity(act, ctx.activities[i + 1], true);
      }

      if (act.attachNext == '>>') {
        addDependentActivity(act, ctx.activities[i + 1], false, true);
      }

      if (act.attachNext == '<<') {
        addDependentActivity(act, ctx.activities[i + 1], true, true);
      }
    });
  });
  return ctxs;
}
