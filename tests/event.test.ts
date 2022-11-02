import { parseLine } from '../src/parse'

const ctx : Context = {
    name: "Testing Context",
    events: []
} 

test('an event tag can be parsed', () =>{
    let e = parseLine('Mow the lawn 1h #yardwork')
    console.log(e)
    expect(e.tags).toContain('yardwork')
})