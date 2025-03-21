const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

const clientId = process.env.CLIENTID;
const token = process.env.CLIENTTOKEN;

if (!clientId || !token) {
    console.error('[ERROR]: Key info isn\'t configd.');
    process.exit(1);
}

const commandsPath = path.join(__dirname, './commands');
console.log(`[DEBUG]: Scanning folder: ${commandsPath}`);

if (!fs.existsSync(commandsPath)) {
    console.error('[ERROR]: Commands folder does not exist.');
    process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(`[DEBUG]: Found command files: ${commandFiles}`);

const commands = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARN]: The command at ${filePath} is missing required properties.`);
    }
}

if (commands.length === 0) {
    console.error('[ERROR]: No commands found to deploy. Ensure your command files are correctly structured.');
    process.exit(1);
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('[ERROR]: Failed to deploy commands.');
        console.error(error);
    }
})();
