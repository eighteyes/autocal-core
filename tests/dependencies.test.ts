import { parseComplete } from '../src/models/contextFn';
import { deps, dependencies } from './inputs';

test('should capture downstream act tags ( > #xyz )', () => {
  const ctxs = parseComplete(deps.mayDownTags);
  expect(ctxs[0].activities[0].dependencies).toHaveProperty('downstreamTags');
  expect(ctxs[0].activities[0].dependencies.downstreamTags).toContain('this');
});

test('should capture upstream act tags ( < #xyz )', () => {
  const ctxs = parseComplete(deps.mayUpTags);
  expect(ctxs[0].activities[0].dependencies).toHaveProperty('upstreamTags');
  expect(ctxs[0].activities[0].dependencies.upstreamTags).toContain('this');
});

test('should implicitly include next act when (<|>) is at line end', () => {
  let ctxs = parseComplete(deps.mayDown);
  expect(ctxs[0].activities[0].dependencies.downstream).toContain(ctxs[0].activities[1]);
  ctxs = parseComplete(deps.mayUp);
  expect(ctxs[0].activities[0].dependencies.upstream).toContain(ctxs[0].activities[1]);
});

test('should link and backlink to dependency activities via tag', () => {
  let ctx = parseComplete(deps.mayDownTags)[0];
  expect(ctx.activities[0].dependencies.downstream).toContain(ctx.activities[2]);
  expect(ctx.activities[2].dependencies.upstream).toContain(ctx.activities[0]);
  ctx = parseComplete(deps.mayUpTags)[0];
  expect(ctx.activities[0].dependencies.upstream).toContain(ctx.activities[2]);
  expect(ctx.activities[2].dependencies.downstream).toContain(ctx.activities[0]);
});

test('should capture next intent', () => {
  let ctx = parseComplete(deps.nextIntent)[0];
  expect(ctx.activities[0].dependencies.attachNext).toBe('>>');
  expect(ctx.activities[1].dependencies.attachNext).toBe('>');
  expect(ctx.activities[3].dependencies.attachNext).toBe('<<');
  expect(ctx.activities[4].dependencies.attachNext).toBe('<');
  expect(ctx.activities[0].dependencies.required.downstream).toContain(ctx.activities[1]);
  expect(ctx.activities[1].dependencies.downstream).toContain(ctx.activities[2]);
  expect(ctx.activities[2].dependencies.required.downstream).toContain(ctx.activities[3]);
  expect(ctx.activities[3].dependencies.required.upstream).toContain(ctx.activities[4]);
  expect(ctx.activities[4].dependencies.upstream).toContain(ctx.activities[5]);
});
