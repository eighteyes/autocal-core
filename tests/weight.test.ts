import { processContextActivities } from '../src/process/processContextActivities';
import { selectActivitiesUsingWeights } from '../src/selectors/selectActivitiesUsingWeights';
import { parseTextIntoContexts } from '../src/parsers/parseTextIntoContexts';
import { Context } from '../src/types/context';
import { contexts } from './inputs';
import { doSelection } from '../src/selection';

let ctxs: Context[] = [];

beforeAll(() => {
  ctxs = parseTextIntoContexts(contexts.long);
  ctxs.forEach((c, i) => processContextActivities(c, i));
  // weight distribution
  ctxs.forEach((c) => {
    // start weights around 50
    c.activities.forEach((a) => {
      a.weight = Math.random() / 2;
    });
  });
});

test.skip('same results will not be generated each time', () => {
  const c = ctxs;
  for (let i = 0; i < 3; i++) {
    let ws = doSelection(c, 10);
    let ws2 = doSelection(c, 10);
    expect(ws).not.toMatchObject(ws2);
  }
});
