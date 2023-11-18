import { Context } from '../types/context';

export function 
applyContext(ctx: Context): Context {
  ctx.activities.forEach((act) => {
    act.links = [...act.links, ...ctx.links];
    act.input.attributes.push(...ctx.input.attributes);
    act.input.tags.push(...ctx.input.tags);
    // act.input.durations.push(...ctx.input.durations);
    // act.input.cyclics.push(...ctx.input.cyclics);
  });

  return ctx;
}
