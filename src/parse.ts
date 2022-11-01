import { regex } from './defaults.js'

export function parseEvent(ln: string, ctx: Context) {

}

export function parseContext(ctx) {

}

export function parseLine(ln: string, ctx: Context) : CalEvent {
    let duration, tags, tokens;

    let done = (ln[0] == 'x')
    if (done) {
        ln = ln.replace('x ', '')
    }

    // start with length, so we have something in place in case of only content
    let splitPoints = [ln.length]
    // cycle through all meta info indices
    const durationMatches = ln.match(regex.duration);
    const tagMatches = ln.match(regex.tag);
    const tokenMatches = ln.match(regex.tokens)

    // find earliest match for a meta info blob
    Array(durationMatches, tagMatches, tokenMatches).forEach(m => {
        if (m) splitPoints.push(m.index)
    })

    let splitIndex = Math.min(...splitPoints)

    let content = ln.slice(0, splitIndex).trim()
    let raw = {
        meta: ln.slice(splitIndex),
        metas: ln.slice(splitIndex).split(' '),
        tokens: tokenMatches.map(t=>t[0]).join('')
    }

    if (durationMatches) { duration = durationMatches[0] }
    if (tagMatches) { tags = tagMatches[0].split(' ') }
    if (tokenMatches) {tokens = tokenMatches.map(t=>t[0]) }

    return { content, raw, duration, tags, tokens, done }

}


function parseTokens(ln) {

}
