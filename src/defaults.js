
const effectNames = {
    '!': 'Urgent',
    '$': 'Important',
    '^': 'Effortful',
    '+': 'Energizing',
    '-': 'Draining',
    '*': 'Required',
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
    tag:/(#[.\w]+\s)+/,
    tokens: new RegExp('[\\'+ Object.keys(effectNames).join('\\')+']' )
}


export { regex, effectNames }