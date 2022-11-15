import { parseComplete } from '../src/models/contextFn';
import { deps } from './inputs';

test('should not include tag in activity if it is a dependency', () => {
  const ctxs = parseComplete(deps.reqTags);
  expect(ctxs[0].activities[0].input.tags).toHaveLength(0);
  expect(ctxs[0].activities[1].input.tags).toHaveLength(1);
});
test('should capture downstream act tags ( > #xyz )', () => {
  const ctxs = parseComplete(deps.mayDownTags);
  expect(ctxs[0].activities[0].links[0].tags).toContain('this');
  expect(ctxs[0].activities[0].links[0].downstream).toBe(true);
});

test('should capture upstream act tags ( < #xyz )', () => {
  const ctxs = parseComplete(deps.mayUpTags);
  expect(ctxs[0].activities[0].links[0].tags).toContain('this');
  expect(ctxs[0].activities[0].links[0].upstream).toBe(true);
});

test('should implicitly include next act when (<|>) is at line end', () => {
  let ctxs = parseComplete(deps.mayDown);
  expect(ctxs[0].activities[0].links[0].reference).toBe(ctxs[0].activities[1]);
  expect(ctxs[0].activities[0].links[0].downstream).toBe(true);
  ctxs = parseComplete(deps.mayUp);
  expect(ctxs[0].activities[0].links[0].reference).toBe(ctxs[0].activities[1]);
  expect(ctxs[0].activities[0].links[0].upstream).toBe(true);
});

test('should link and backlink to dependency activities via tag', () => {
  let ctx = parseComplete(deps.mayDownTags)[0];
  expect(ctx.activities[0].links[0].reference).toBe(ctx.activities[2]);
  expect(ctx.activities[2].links[0].reference).toBe(ctx.activities[0]);
  ctx = parseComplete(deps.mayUpTags)[0];
  expect(ctx.activities[0].links[0].reference).toBe(ctx.activities[2]);
  expect(ctx.activities[2].links[0].reference).toBe(ctx.activities[0]);
});

test('should capture next intent', () => {
  let ctx = parseComplete(deps.nextIntent)[0];
  expect(ctx.activities[0].attachNext).toBe('>>');
  expect(ctx.activities[1].attachNext).toBe('>');
  expect(ctx.activities[3].attachNext).toBe('<<');
  expect(ctx.activities[4].attachNext).toBe('<');
  expect(ctx.activities[0].links[0].reference).toBe(ctx.activities[1]);
  expect(ctx.activities[1].links[0].reference).toBe(ctx.activities[0]);
  expect(ctx.activities[1].links[1].reference).toBe(ctx.activities[2]);
  expect(ctx.activities[2].links[0].reference).toBe(ctx.activities[1]);
  expect(ctx.activities[2].links[1].reference).toBe(ctx.activities[3]);
  expect(ctx.activities[3].links[0].reference).toBe(ctx.activities[2]);
  expect(ctx.activities[3].links[1].reference).toBe(ctx.activities[4]);
  expect(ctx.activities[4].links[0].reference).toBe(ctx.activities[3]);
  expect(ctx.activities[4].links[1].reference).toBe(ctx.activities[5]);
  expect(ctx.activities[5].links[0].reference).toBe(ctx.activities[4]);
});

test('should make required implicit dependencies unavailable', () => {
  const ctxs = parseComplete(deps.nextIntent);
  expect(ctxs[0].activities[1].available).toBe(false);
});

test('should make required dependencies by tag unavailable', () => {
  let ctxs = parseComplete(deps.reqTags);
  expect(ctxs[0].activities[1].available).toBe(false);
  ctxs = parseComplete(deps.reqDoneTags);
  expect(ctxs[0].activities[1].available).toBe(true);
});
