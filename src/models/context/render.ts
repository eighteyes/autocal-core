import { Context } from '../../types/context';

export function renderContext(ctx: Context) {
  let acts = ctx.activities.map((a) => {
    return a.input.raw;
  });
  let actString = acts.length > 0 ? acts.join('\n') + '\n' : '';
  return ctx.input.raw + '\n' + actString;
}
