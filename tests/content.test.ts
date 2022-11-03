import { parseLine } from '../src/parse'
import { content } from './inputs'

test('Can split basic content', () => {
    let e = parseLine(content.splitBasic)
    expect(e.content).toBe("Call Marcelo RE : Landing Page")
})