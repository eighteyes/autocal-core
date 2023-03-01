import config from '../config';
import { Context } from '../types/context';

// adjust weights, and recast to integer for display purposes

export function generateWeights(ctx: Context) {
  let adjustedIndex = 0;
  ctx.activities.forEach((c, i) => {
    // apply a slight weighting towards the top of the list
    // TODO: toggle from config - applyPositionWeight
    c.integerWeight -= adjustedIndex * config.positionWeight;

    // we don't want to consider done tasks with position weights
    if (!c.done) {
      adjustedIndex++;
    }

    // turn integer into float - important to know about
    c.weight = Math.min(c.integerWeight / Math.pow(10, config.integerWeightFactor), 1);
  });
}
