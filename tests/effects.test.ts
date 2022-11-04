import { parseLine } from '../src/parse'
import { effectList } from '../src/defaults'
import { effects } from './inputs'

test('should collect raw effects', () => {
    let e = parseLine(effects.many)
    expect(e.effects).toHaveLength(4);
});

test('should weight activities based on effects', () => {
    let e = parseLine(effects.many);

});