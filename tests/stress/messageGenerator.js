const data = [
    "What drugs does Cristina921 take?",
    "What patients have had drug Etonogestrel 68 MG Drug Implant?",
    "What is Cristina921's address?",
    "Which patients have the address 496 McGlynn Burg Suite 36?",
    "What do Cristina921 and Emile522 have in common?",
    "Hello"
]

function generateRandomMessage(context, events, done) {
    context.vars['message'] = data[Math.floor(Math.random() * data.length)];
    return done();
}

module.exports = {
    generateRandomMessage
}