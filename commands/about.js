const {SlashCommandBuilder, Guild, MessageFlags, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About this bot'),
    async execute(interaction){
        //
    }
}