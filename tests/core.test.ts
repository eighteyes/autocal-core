import { readFile } from '../src/read';

import { getAll, addRawContext } from '../src/index';

test('Can get all', () => {
  const f = readFile('./examples/plan.acr');
  console.log(getAll(f));
});

test('Can add Raw Context', () => {
  const l = addRawContext('before', 'test');
  console.log(l);
});
