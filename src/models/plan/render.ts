import { Context } from '../../types/context';
import { renderContext } from '../context/render';

export function renderPlan(ctxs: Context[]) {
  return ctxs.map(renderContext).join('\n');
}
