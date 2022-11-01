import { regex} from './defaults.js'

const tokenFns = {
    '!': (e) => {
        let o = {}
        o[tokenNames[tokenFns['!'].name]] = true;
        return o;
    }
}

export function parseEvent(ln, ctx){

}

export function parseContext(ctx){

}

export function parseLine(ln){
    let duration, tags, tokens;

    let done = ( ln[0] == 'x' )
    if ( done ){
        ln = ln.replace('x ','')
    }

    // start with length, so we have something in place in case of only content
    let splitPoints = [ln.length]
    // cycle through all meta info indices
    const durationMatches = ln.match(regex.duration);
    const tagMatches = ln.match(regex.tag);
    const tokenMatches = ln.match(regex.tokens)

    Array( durationMatches, tagMatches, tokenMatches ).forEach( m => {
        if (m) splitPoints.push(m.index)
    })

    let splitIndex = Math.min(...splitPoints)
    
    let content = ln.slice(0, splitIndex).trim()
    let metaRaw = ln.slice(splitIndex)
    let metas = metaRaw.split(' ')
    

    if (durationMatches) { duration = durationMatches[0] }
    if ( tagMatches ) { tags = tagMatches[0].split(' ') }
    if ( tokenMatches ){}
    
    let o =  {content, metaRaw, metas, duration, tags, tokens, done }

    return o

}


function parseTokens(ln){

}
