import { makeTestRef } from './utils';

const ctx = '# Context\n';

export const tags = {
  single: 'Mow the lawn 1h #yardwork',
  multiple: 'Mow the lawn 1h #yardwork #hardwork',
  ctxMultiple:
    ctx +
    [
      'Thing1 #tag1 #tag2',
      'Thing2 #tag2',
      'Thing3 #tag3',
    ].join('\n'),
};

export const duration = {};

export const dependencies = {};

export const attributes = {
  many: 'Very Important 1h !*$^+-',
  all: 'A thing! to do !*$`',
};

export const content = {
  splitBasic: 'Call Marcelo RE : Landing Page 1h',
  splitComplex: 'Presents 4 Judy & Mark! // (and f) 4h',
};

export const contexts = {
  basic: '# Context\nDo Thing !',
  long:
    ctx + Array(100).fill(makeTestRef(), 0, 100).join('\n'),
};

export const deps = {
  mayDown: ctx + ['A thing >', 'Another Thing'].join('\n'),
  mayUp: ctx + ['A thing <', 'Another Thing'].join('\n'),
  mayDownTags:
    ctx +
    ['no tag > #this', 'skip', 'tagged #this'].join('\n'),
  mayUpTags:
    ctx +
    ['no tag < #this', 'skip', 'tagged #this'].join('\n'),
  nextIntent:
    ctx +
    ['A >>', 'B >', 'C >>', 'E <<', 'D <', 'CC '].join(
      '\n'
    ),
};
