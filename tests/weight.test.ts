import { Weight } from '../src/models/weight'
import { makeRandom } from '../src/utils'

function makeTestRef(){
    return Math.random().toString(26).slice(2,8);
}

function makeTestWeight(){
    return new Weight( makeRandom(), makeTestRef() )
}

let testWeights: Weight[] = [];

beforeAll(() => {
    for (let i = 0; i < 100; i++) {
        testWeights.push( makeTestWeight() )
    }
})

test('should be able to select top weight', () => {
    const w = new Weight(1000, "abc123")
    
    expect(Weight.selectTop()[0]).toMatchObject(w)
    
    // reset
    Weight.weights.pop();
})



test('same results will not be generated each time', () => {
    for (let i = 0; i < 3; i++) {
        let ws : Weight[] = Weight.selectUsingWeights(3);
        let ws2 : Weight[] = Weight.selectUsingWeights(3);
        expect(ws).not.toMatchObject(ws2)
    }
})