interface Effect {
    symbol: string,
    name: string,
    weight: number
}
const effects: Effect[] = [
    { symbol: "!", name: 'Urgent', weight: 20 },
    { symbol: "$", name: 'Important', weight: 20 },
    { symbol: "^", name: 'Hard', weight: 5 },
    { symbol: "+", name: 'Energizing', weight: 0 },
    { symbol: "-", name: 'Draining', weight: 0 },
    { symbol: "*", name: 'Required', weight: 100 },
]

const actions = {
    '>': 'Unblocks',
    '<': 'Depends On'
}

const times = {
    'm': 'months', 'h': 'hours', 'd': 'days', 'w': 'weeks'
}

const regex = {
    contextHashMatch: /^#*./,
    duration: /\b\d*[mhdw]/,
    content: /^([A-Za-z]\w+\s)$/,
    tag:/#([.\w]+\S)/g,
    tokens: new RegExp('/w[\\'+ effects.map(e=>e.symbol).join('\\')+']/w' )
}

const orderingAlgo = "^+"

export { regex, effects, orderingAlgo }