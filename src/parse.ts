import { regex } from './defaults'

export function parseEvent(ln: string, ctx: Context) {

}

export function parseTextIntoContextsAndEvents(input:string) {
    let contextraws: string[] = []
    let contexts: Context[] = []
    let events: CalEvent[] = []

    // break input into context blocks
    const contextStrings = input.split('\n\n')
    contextStrings.forEach((c: string) => {
        // trim in case of extra whitespace btwn contexts
        contextraws.push(c.trim())
    })

    contextraws.forEach((c) => {
        // split along lines
        let line = c.split('\n')
        // shift mutates array
        let raw: string = line.shift()

        let ctx: Context = {
            name: raw.replace(regex.contextHashMatch, ''),
            events: [],
            raw
        }

        // cycle through every event in the context
        line.forEach((ln) => {
            const e: CalEvent = parseLine(ln)
            ctx.events.push(e)
            events.push(e)
        })

        contexts.push(ctx)
    })
    return { contexts, events }
}

export function parseLine(ln: string, ctx?: Context): CalEvent {
    let duration, tags, tokens; 

    console.log(ln)

    let done = (ln[0] == 'x')
    if (done) {
        ln = ln.replace('x ', '')
    }

    // start with length, so we have something in place in case of only content
    let splitPoints = [ln.length]
    // cycle through all meta info indices
    const durationMatches = ln.match(regex.duration);
    const tagMatches = ln.match(regex.tag)
    const tokenMatches = ln.match(regex.tokens)
    console.log(tagMatches)

    // find earliest match for a meta info blob
    Array(durationMatches, tagMatches, tokenMatches).forEach(m => {
        if (m) splitPoints.push(m.index)
    })

    let splitIndex = Math.min(...splitPoints)

    let content = ln.slice(0, splitIndex).trim()
    let raw = {
        meta: ln.slice(splitIndex),
        metas: ln.slice(splitIndex).split(' '),
        // tokens: tokenMatches.map(t=>t[0]).join('')
    }

    if (durationMatches) { duration = durationMatches[0] }
    // regex filters out the # for tag names
    if (tagMatches) { tags = tagMatches.map(t => t.slice(1)) }
    if (tokenMatches) { tokens = tokenMatches.map(t => t[0]) }

    return { content, raw, duration, tags, tokens, done }

}


function parseTokens(ln) {

}
