const {Client, IntentsBitField} = require('discord.js')
const client = new Client({
    intents:[
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.Guilds,
    ]
})

module.exports = client