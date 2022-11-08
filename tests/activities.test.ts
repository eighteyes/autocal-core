import { parseLine } from '../src/models/contextFn'
import { content } from './inputs'

test('Can split content', () => {
    let e = parseLine(content.splitBasic)
    expect(e.content).toBe("Call Marcelo RE : Landing Page")
    e = parseLine(content.splitComplex)
    expect(e.content).toBe("Presents 4 Judy & Mark! // (and f)")
})

test('Can generate unique references from similiar strings', ()=>{
    
})