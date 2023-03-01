import { Context } from '../types/context';
import { cyclics } from '../../tests/inputs';

export function calculateCyclicWeight(ctx: Context): Context {
  ctx.activities.forEach((act) => {
    // calculate things now that context is applied
    // calculate cyclic strength
    act.cyclicStrength = act.input.cyclics.reduce((a, b) => {
      if (b !== '+' && b !== '-') {
        console.error('Bad cyclic indicator', b, cyclics);
      }
      let amt = b == '+' ? 1 : -1;
      return a + amt;
    }, 0);
  });

  return ctx;
}
