import * as inputs from './inputs';
import config from '../src/config';
import { parseComplete } from '../src/parsers/parseComplete';
import { selectByAttribute } from '../src/selection';
import {Activity} from '../src';

test('selection respects `includeNoneInSelection', () => {
  let ctxs = parseComplete(inputs.select.equal);
  let acts: Activity[] = selectByAttribute(ctxs, '0');
  expect(acts.length).toEqual(3);
})

test('can select a sign using an algorithm', () => {
  let ctxs = parseComplete(inputs.select.equal);
  let acts: Activity[] = selectByAttribute(ctxs, '+');
  expect(acts.length).toEqual(3);
});

test.todo('can distinguish between selection attribute intensity')