import { parseComplete } from "../src/models/contextFn";
import { deps } from "./inputs";

test('should capture downstream act tags ( > #xyz )', () => {
    const ctxs = parseComplete(deps.mayDownTags)
    expect(ctxs[0].activities[0]).toHaveProperty('downstreamTags')
    expect(ctxs[0].activities[0].downstreamTags).toContain('this')
})

test('should capture upstream act tags ( < #xyz )', () => {
    const ctxs = parseComplete(deps.mayUpTags)
    expect(ctxs[0].activities[0]).toHaveProperty('upstreamTags')
    expect(ctxs[0].activities[0].upstreamTags).toContain('this')
})

test('should implicitly include next act when (<>) is at line end', () => {
    let ctxs = parseComplete(deps.mayDown)
    expect(ctxs[0].activities[0].downstream).toContain(ctxs[0].activities[1])
    ctxs = parseComplete(deps.mayUp)
    expect(ctxs[0].activities[0].upstream).toContain(ctxs[0].activities[1])
});

test('should link and backlink to dependency activities via tag', ()=>{
    let ctx = parseComplete(deps.mayDownTags)[0]
    expect(ctx.activities[0].downstream).toContain(ctx.activities[2]);
    expect(ctx.activities[2].upstream).toContain(ctx.activities[0]);
    ctx = parseComplete(deps.mayUpTags)[0]
    expect(ctx.activities[0].upstream).toContain(ctx.activities[2]);
    expect(ctx.activities[2].downstream).toContain(ctx.activities[0]);
})
