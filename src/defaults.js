
const tokens = {
    '!': 'Urgent',
    '$': 'Important',
    '^': 'Effortful',
    '+': 'Fun',
    '-': 'Painful',
    '&': 'Required'
}

const times = {
    'm': 'months', 'h': 'hours', 'd': 'days', 'w': 'weeks'
}

const regex = {
    contextHashMatch: /^#*./,
    duration: /\b\d*[mhdw]/
}


export { regex, tokens }