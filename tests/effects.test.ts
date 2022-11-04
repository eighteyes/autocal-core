import { parseLine } from '../src/parse'
import { effectList, startWeight } from '../src/defaults'
import { effects } from './inputs'

test('should collect raw effects', () => {
    let e = parseLine(effects.many)
    expect(e.effects).toHaveLength(3);
});

test('should weight activities based on effects', () => {
    let e = parseLine(effects.all);
    const totalWeight = effectList.reduce((a, b) => {
        return a + b.weight;
    },0 ) + startWeight;
    expect(e.integerWeight).toBe(totalWeight)
});