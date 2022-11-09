
export const attributeList: Attribute[] = [
    { symbol: "!", name: 'Urgent', weight: 20 },
    { symbol: "$", name: 'Important', weight: 20 },
    { symbol: "*", name: 'Required', weight: 40 },
    { symbol: "`", name: 'Nudge', weight: 2 }
]

// { symbol: "+", name: 'Energizing', weight: 0 },
// { symbol: "-", name: 'Draining', weight: 0 },

export const actions = {
    '>': 'Unblocks',
    '<': 'Depends On',
    '+': 'Energize',
    '-': 'Drain'
}

export const times = {
    'm': 'months', 'h': 'hours', 'd': 'days', 'w': 'weeks'
}

export const regex = {
    contextHashMatch: /^#*./,
    duration: /\b\d*[mhdw]/g,
    content: /^([A-Za-z]\w+\s)$/,
    tag:/#([.\w]+\S)/g,
    attributes: new RegExp('\\B['+ attributeList.map(e=>e.symbol) + ']+' , 'g'),
    lettersOnly: /[^\w]/g,
    dependencies: /[<>]{1,3}/g

}

// /\s[!\$\^\*]+/g

export const orderingAlgo = "^+"
export const startWeight = 50;
