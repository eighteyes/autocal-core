import config from '../config';
import { Context } from '../types/context';
import { Attribute } from '../types/attribute';

export function calculateAttributeWeight(ctx: Context): Context {
  ctx.activities.forEach((act) => {
    act.integerWeight = config.startWeight;
    act.input.attributes.forEach((att) => {
      // look up weight for this attribute
      let eObj = config.attributeList.filter((e1: Attribute) => {
        return e1.symbol == att;
      })[0];
      // add to running total for this activity
      act.integerWeight += eObj.weight;
    });
  });
  return ctx;
}
