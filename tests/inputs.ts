import { makeTestRef } from './utils';

const ctx = '# Context\n';
const ctxa = '# ActContext !$+-\n';
const ctxp = '# Plus +\n';
const ctxm = '# Minus -\n';

export const tags = {
  single: 'Mow the lawn 1h #yardwork',
  multiple: 'Mow the lawn 1h #yardwork #hardwork',
  ctxMultiple: ctx + ['Thing1 #tag1 #tag2', 'Thing2 #tag2', 'Thing3 #tag3'].join('\n'),
};

export const cyclics = {
  basic: ctx + 'Test Plus and Minus !+-$',
  plusContext: ctxp + ['A', 'B', 'C'].join('\n'),
  justContext: ctxp,
  weighty: ctx + 'Test Lots of +++-',
};

export const duration = {};

export const dependencies = {};

export const attributes = {
  many: 'Very Important 1h !*$^+-',
  all: ctx + 'A thing! to do !*$`',
  multi: ctx + 'Super Important !!!',
};

export const content = {
  splitBasic: 'Call Marcelo RE : Landing Page 1h',
  splitComplex: 'Presents 4 Judy & Mark! // (and f) 4h',
};

export const contexts = {
  basic: '# Context\nDo Thing !',
  long: ctx + Array(100).fill(makeTestRef(), 0, 100).join('\n'),
  actCtx: ctxa + ['One', 'Two', 'Three'].join('\n'),
  many: [ctx, ctxa, ctxm, ctxp]
    .map((c) => {
      return c + ['One', 'Two', 'Three'].join('\n') + '\n';
    })
    .join('\n'),
};

export const deps = {
  mayDown: ctx + ['A thing >', 'Another Thing'].join('\n'),
  mayUp: ctx + ['A thing <', 'Another Thing'].join('\n'),
  mayDownTags: ctx + ['no tag > #this', 'skip', 'tagged #this'].join('\n'),
  mayUpTags: ctx + ['no tag < #this', 'skip', 'tagged #this'].join('\n'),
  nextIntent: ctx + ['A >>', 'B >', 'C >>', 'E <<', 'D <', 'CC '].join('\n'),
  reqTags: ctx + ['A >> #tag', 'B #tag'].join('\n'),
  reqDoneTags: ctx + ['x A >> #tag', 'B #tag'].join('\n'),
  refIncluded: ctx + ['Source >> #tag', 'Target #tag 2h >>>'].join('\n'),
};

export const select = {
  equal:
    ctx +
    ['A', 'B', 'C', '', ''].join('\n') +
    ctxp +
    ['Ap', 'Bp', 'Cp', '', ''].join('\n') +
    ctxm +
    ['Am', 'Bm', 'Cm'].join('\n'),
  extrastrength:
    ctx +
    ['A', 'B', 'C', '', ''].join('\n') +
    ctxp +
    ['Ap +', 'Bp ++', 'Cp +++', '', ''].join('\n') +
    ctxm +
    ['Am -', 'Bm --', 'Cm ---'].join('\n'),
};

export const text = {
  multi: ctx + ['A', 'B', 'C', '', ''].join('\n') + ctxp,
  multi2: ctx + ['A', 'B', 'C', '', ''].join('\n') + ctxp + ['A', 'B', ''].join('\n'),
};

export const edgeCases = {
  one: 'make defaults into config object 2h >>',
};
