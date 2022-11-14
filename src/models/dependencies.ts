import { Context } from './context';
import { findActivitiesByTags } from './contextFn';
import { addDependentActivity, getDependencyTags } from './activityFn';
import { Activity, ActivityLink } from './activity';
import { makeTestRef } from '../../tests/utils';

export function generateDependencies(ctx: Context): Context {
  // cycle through activities for this context
  ctx.activities.forEach((act, i) => {
    // start here, tag links hasn't been hydrated with refs yet
    if (act.links.length !== 0) {
      // dep activities for all the linked tags need to backlink
      act.links.forEach((link: ActivityLink) => {
        // in case links have been set up by a prior act
        if (link.hasOwnProperty('reference')) {
          return;
        }

        if (link.hasOwnProperty('tags') && link.tags.length !== 0) {
          let matchingActivities: Activity[] = findActivitiesByTags(ctx, link.tags);
          matchingActivities.forEach((ma) => {
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

    // link implicit references
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
  return ctx;
}
