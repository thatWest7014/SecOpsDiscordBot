const client = require('./Client');
const {MessageFlags, Collection, Events, Message, EmbedBuilder} = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('node:path');
const pkg = require('./package.json');

client.on('ready', () => {
    console.log(`${client.user.tag} Ready!`);
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const commandsPath = path.join(__dirname, '.', 'commands'); 
function getCommandFiles(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            files = files.concat(getCommandFiles(filePath));
        } else if (file.endsWith('.js')) {
            files.push(filePath);
        }
    });
    return files;
}
try {
    const commandFiles = getCommandFiles(commandsPath);
    console.log('Command files found:', commandFiles);
    for (const file of commandFiles) {
        const command = require(file);
        if (command?.data?.name) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`Invalid command file: ${file}`);
        }
    }
} catch (err) {
    console.error('Error reading commands directory:', err);
}

const InfoEmbed = new EmbedBuilder()
    .setColor(0x500050)

client.on('message', (messageCreate) => {
    if (Message.content == "How SecOps"){
        Message.reply({ embeds: [InfoEmbed], flags: MessageFlags.Ephemeral});
    }
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
        interaction.reply({ content:`No command matching \`${interaction.commandName}\` was found.`, flags: MessageFlags.Ephemeral});
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(process.env.CLIENTTOKEN);