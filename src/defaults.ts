interface Effect {
    symbol: string,
    name: string,
    weight: number
}
const effectList: Effect[] = [
    { symbol: "!", name: 'Urgent', weight: 20 },
    { symbol: "$", name: 'Important', weight: 20 },
    { symbol: "^", name: 'Hard', weight: 5 },
    { symbol: "*", name: 'Required', weight: 100 },
]

// { symbol: "+", name: 'Energizing', weight: 0 },
// { symbol: "-", name: 'Draining', weight: 0 },

const actions = {
    '>': 'Unblocks',
    '<': 'Depends On'
}

const times = {
    'm': 'months', 'h': 'hours', 'd': 'days', 'w': 'weeks'
}

const regex = {
    contextHashMatch: /^#*./,
    duration: /\b\d*[mhdw]/g,
    content: /^([A-Za-z]\w+\s)$/,
    tag:/#([.\w]+\S)/g,
    effects: new RegExp('\\B['+ effectList.map(e=>e.symbol).join("\\") + ']+' , 'g')
}

// /\s[!\$\^\*]+/g

const orderingAlgo = "^+"

export { regex, effectList, orderingAlgo }