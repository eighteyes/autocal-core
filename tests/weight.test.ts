import { Context } from "../src/models/context";
import { selectActivityUsingWeights } from "../src/models/contextFn";
import { parseTextIntoContextsAndActivities } from "../src/parse"
import { context } from "./inputs"

let ctxs: Context[] = [];

beforeAll(() => {
    ctxs = parseTextIntoContextsAndActivities(context.long);
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