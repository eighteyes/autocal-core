interface Effect {
    symbol: string,
    name: string,
    weight: number
}

export const effectList: Effect[] = [
    { symbol: "!", name: 'Urgent', weight: 20 },
    { symbol: "$", name: 'Important', weight: 20 },
    { symbol: "*", name: 'Required', weight: 100 },
]

// { symbol: "+", name: 'Energizing', weight: 0 },
// { symbol: "-", name: 'Draining', weight: 0 },

export const actions = {
    '>': 'Unblocks',
    '<': 'Depends On'
}

export const times = {
    'm': 'months', 'h': 'hours', 'd': 'days', 'w': 'weeks'
}

export const regex = {
    contextHashMatch: /^#*./,
    duration: /\b\d*[mhdw]/g,
    content: /^([A-Za-z]\w+\s)$/,
    tag:/#([.\w]+\S)/g,
    effects: new RegExp('\\B['+ effectList.map(e=>e.symbol) + ']+' , 'g')
}

// /\s[!\$\^\*]+/g

export const orderingAlgo = "^+"
export const startWeight = 50;
