import { Activity } from '../types/activity';
import config from '../config';

/**
 * Class to manage weighted selection. Keeps a reference to Activity so we can work on weights in isolation
 * and process selected Activities. Note, integer weight is > 0, mainly used for display.
 * Remember, weight starts at 0.5 and adjusts based on priority.
 */
export class Weight {
  weight: number;
  reference: Activity;
  static weights: Weight[] = [];

  constructor(weight: number, reference: Activity) {
    if (weight >= 1) {
      this.weight = weight / Math.pow(10, config.integerWeightFactor);
    }
    this.reference = reference;
    Weight.weights.push(this);
  }

  static selectTop(count: number = 1) {
    return Weight.sortWeights().slice(0, count);
  }

  static sortWeights() {
    let sortedWeights: Weight[] = [];
    sortedWeights = Weight.weights.sort((a: Weight, b: Weight) => {
      if (a.weight < b.weight) return 1;
      if (a.weight > b.weight) return -1;
      if (a.weight === b.weight) return 0;
    });
    return sortedWeights;
  }

  static selectUsingWeights(count: number = 1) {
    let output: Weight[] = [];

    for (let i = 0; i < Weight.sortWeights().length; i++) {
      const element = Weight.weights[i];
      // Crux of non-deterministic selection, use weight as % chance
      // see Random Analysis.ipynb for proof
      // > here means that high priority items are more likely to be skipped
      // which is fine because they are generally selected first. the thesis being that
      // user bias will trend towards giving too many things high priority
      // < would mean that less randomness impacts heavier items
      // but this won't be used because we sort by importance
      if (Math.random() > element.weight) {
        output.push(element);
      }
      if (output.length >= count) {
        break;
      }
    }

    return output;
  }
}
