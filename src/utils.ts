export function makeRandom(){
    return Math.ceil(Math.random()*99)
}

export function makeTestRef(){
    return Math.random().toString(26).slice(2,8);
}

export function makeTestWeight(){
    return [ makeRandom(), makeTestRef() ]
}