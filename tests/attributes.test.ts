import { parseLine } from '../src/parse'
import { attributeList, startWeight } from '../src/defaults'
import { attributes } from './inputs'

test('should collect raw attributes', () => {
    let e = parseLine(attributes.many)
    expect(e.attributes).toHaveLength(3);
});

test('should weight activities based on attributes', () => {
    let e = parseLine(attributes.all);
    const totalWeight = attributeList.reduce((a, b) => {
        return a + b.weight;
    },0 ) + startWeight;
    expect(e.integerWeight).toBe(totalWeight)
});