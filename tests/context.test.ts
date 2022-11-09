import * as fn from '../src/models/contextFn'
import * as inputs from './inputs'


test('can findActivitiesByTag', ( ) => {
    let ctxs = fn.parseComplete(inputs.tags.ctxMultiple)[0]
    expect(fn.findActivitiesByTag(ctxs, 'tag1')).toHaveLength(1)   
    expect(fn.findActivitiesByTag(ctxs, 'tag2')).toHaveLength(2)   
})

test('can findActivitiesByTags', ( ) => {
    let ctxs = fn.parseComplete(inputs.tags.ctxMultiple)[0]
    expect(fn.findActivitiesByTags(ctxs, ['tag1','tag2'])).toHaveLength(2)   
})