import {tokenNames, regex} from './defaults.js'

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
    let tokensRaw = metaRaw.split(' ')

    if (durationMatches) { duration = durationMatches[0] }
    if ( tagMatches ) { tags = tagMatches[0].split(' ')}
    if ( tokenMatches ){}
    
    console.log( {content, metaRaw, tokensRaw, duration, tags, tokens })

    // //split txt from meta
    // let fragments = ln.match(regex.content)
    // let o = {};
    // // what is the index where we can split?
    // if ( !fragments ){
    //     console.error(fragments)
    //   throw ln + ' is missing content or meta-information' 
    // } else {
    //     // remove matched tags ( regex solution? )
    //     console.log(fragments)
    //     fragments = fragments.filter( f => f.indexOf('#') == -1 )
    //     let finalWord = fragments.pop()
    //     let splitIndex = ln.lastIndexOf(finalWord) + finalWord.length
    //     // in case of tag
    //     let content = ln.slice(0, splitIndex)
    //     let meta = ln.slice(splitIndex)

    //     console.log( content, '\n', meta )
    // }
}


function parseTokens(ln){

}
