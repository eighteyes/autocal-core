import { parseLine } from '../src/parse'
import { tags } from './inputs'

test('an event tag can be parsed', () =>{
    let e = parseLine(tags.single)
    expect(e.tags).toContain('yardwork')
})

test('many event tags can be parsed', () => {
    let e = parseLine(tags.multiple)
    expect(e.tags).toContain('yardwork')
    expect(e.tags).toContain('hardwork')
    expect(e.tags).toHaveLength(2)
})