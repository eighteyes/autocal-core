import { 
    selectActivityUsingWeights, 
    processContext, 
    parseTextIntoContexts 
} from "../src/models/contextFn";

import { contexts } from "./inputs"

let ctxs = [];

beforeAll(() => {
    ctxs = parseTextIntoContexts(contexts.long);
    ctxs.forEach((c)=>processContext(c))
    // weight distribution
    ctxs.forEach((c) => {
        c.activities.forEach((a) => { a.weight = Math.random() })
    })
})

test('same results will not be generated each time', () => {
    const c = ctxs[0];
    for (let i = 0; i < 3; i++) {
        let ws = selectActivityUsingWeights(c, 3);
        let ws2 = selectActivityUsingWeights(c, 3);
        expect(ws).not.toMatchObject(ws2)
    }
})