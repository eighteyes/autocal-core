import {
  selectActivityUsingWeights,
  processContext,
  parseTextIntoContexts,
} from '../src/models/contextFn';
import { Context } from '../src/models/context';
import { contexts } from './inputs';

let ctxs: Context[] = [];

beforeAll(() => {
  ctxs = parseTextIntoContexts(contexts.long);
  ctxs.forEach((c) => processContext(c));
  // weight distribution
  ctxs.forEach((c) => {
    // start weights around 50
    c.activities.forEach((a) => {
      a.weight = Math.random() / 2;
    });
  });
});

test('same results will not be generated each time', () => {
  const c = ctxs[0];
  for (let i = 0; i < 3; i++) {
    let ws = selectActivityUsingWeights(c, 10);
    let ws2 = selectActivityUsingWeights(c, 10);
    expect(ws).not.toMatchObject(ws2);
  }
});
