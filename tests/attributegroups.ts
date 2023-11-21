import { groupActivityByAttribute } from '../src/selection';
import * as inputs from './inputs';
import { parseComplete } from '../src/parsers/parseComplete';


test('can group activity by attribute indicators', () => {
  let g = groupActivityByAttribute(parseComplete(inputs.select.equal));
  expect(g.byAttribute).toHaveProperty(['-']);
  expect(g.byAttribute).toHaveProperty(['0']);
  expect(g.byAttribute).toHaveProperty(['+']);
});


test.todo('can group activity by multiple attribute indicators', () => {  
    let g = groupActivityByAttribute(parseComplete(inputs.select.extrastrength));
    expect(g.byAttribute).toHaveProperty(['---']);
    expect(g.byAttribute).toHaveProperty(['0']);
    expect(g.byAttribute).toHaveProperty(['+']);
})