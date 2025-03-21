const {SlashCommandBuilder, Guild, MessageFlags, EmbedBuilder, ChannelType} = require('discord.js');
const emoji = require('../emoji.json');
const pkg = require('../package.json');

const AnnceChannelID = "";
const LongChannelID = "";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tryout')
        .setDescription('Manage Tryouts')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new Tryout.')
                .addRoleOption(option =>
                    option.setName('notification_role') // Fixed name
                        .setDescription('Role to ping for notifications.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('timestamp')
                        .setDescription('Timestamp of the tryout.')
                        .setRequired(true)
                        .setMaxLength(30))
                .addChannelOption(option =>
                    option.setName('event_channel') // Fixed name
                        .setDescription('Where the event is being held.')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildStageVoice))) // Corrected placement of addChannelTypes) // Corrected placement of addChannelTypes
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edit an existing Tryout.')
                .addRoleOption(option =>
                    option
                        .setName('notification_role') // Fixed name
                        .setDescription('Role to ping for notifications.')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('new_timestamp') // Fixed name
                        .setDescription('New timestamp of the tryout.')
                        .setRequired(true)
                        .setMaxLength(30)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('cancel')
                .setDescription('Cancels an existing tryout.')
                .addRoleOption(option =>
                    option
                        .setName('notification_role') // Fixed name
                        .setDescription('Role to ping for notifications.')
                        .setRequired(true))),
    async execute(interaction) {
        if (!Guild) return interaction.reply({ content: `This command can only be used in a server.`, flags: MessageFlags.Ephemeral });
        if (interaction.options.getSubcommand() == "create") {
            var dateTime = interaction.options.getString('timestamp');
            var eventChannel = interaction.options.getChannel('event_channel');

            // Fallback to find a stage channel with "tryout" in its name
            if (!eventChannel || eventChannel.type !== ChannelType.GuildStageVoice) {
                eventChannel = interaction.guild.channels.cache.find(channel =>
                    channel.type === ChannelType.GuildStageVoice && channel.name.toLowerCase().includes('tryout')
                );

                if (!eventChannel) {
                    return interaction.reply({ content: `No valid event channel found. Please specify a valid stage channel or ensure a channel with "tryout" in its name exists.`, flags: MessageFlags.Ephemeral });
                }
            }

            const tryoutEmbed = new EmbedBuilder()
                .setColor(0x264a78)
                .setAuthor({ name: 'Scheduled Tryout' })
                .addFields(
                    {
                        name: `<:Info:${emoji.info}> Tryout Details`,
                        value: `A tryout has been scheduled by **${interaction.member?.nickname || interaction.user.username}**.\n\n` +
                               `- **When?** ${dateTime} (your local time).\n` +
                               `- **Where?** Join the designated <#${eventChannel.id}> stage.\n` +
                               `- **Attendance:** React to the <:Check:${emoji.check}> below to confirm.`,
                    },
                    {
                        name: `<:Info:${emoji.info}> Rules`,
                        value: `- Follow all instructions from the tryout host.\n` +
                               `- Do not speak unless given permission.\n` +
                               `- Notify staff if you need to go AFK.\n` +
                               `- Use proper grammar unless instructed otherwise.\n` +
                               `- Sharing event details is prohibited.`,
                    },
                    {
                        name: `<:Info:${emoji.info}> Dress Code`,
                        value: `- Remove all items from your ROBLOX avatar:\n` +
                               `  - No shirts, pants, or accessories.\n` +
                               `  - No hats or animated faces.\n` +
                               `  - Use default "blocky" avatars only.`,
                    },
                    {
                        name: `<:ShieldDenied:${emoji.denied}> Dismissal Policy`,
                        value: `- Dismissed participants may attend another tryout without penalty.\n` +
                               `- Complaining about dismissal will result in consequences.\n` +
                               `- Leave the stage if dismissed.`,
                    },
                    {
                        name: `<:Warning:${emoji.failure}> Disclosure`,
                        value: `The hosting group reserves the right to pass, fail, or blacklist participants at its discretion.`,
                    }
                )
                .setTimestamp();
                interaction.channel.send(`<@&${interaction.options.getRole('notification_role').id}>`);
                var embed = await interaction.channel.send({ embeds: [tryoutEmbed] });
                await embed.react(emoji.check);

        } else if (interaction.options.getSubcommand() == "edit") {
            //
        } else if (interaction.options.getSubcommand() == "cancel") {
            //
        } else {
            await interaction.reply({ content: `An error occurred locating the subcommand.`, flags: MessageFlags.Ephemeral });
            return;
        }
    }
};