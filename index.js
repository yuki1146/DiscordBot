const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    Events,
    PresenceUpdateStatus,
    ActivityType,
    Collection,
} = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commands = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'))
    .map((file) => {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        return command.data.toJSON();
    });

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log('コマンドの登録完了');
    } catch (error) {
        console.error(error);
    }
})();

const loadEvents = () => {
    const eventFiles = fs
        .readdirSync('./events')
        .filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.name) {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
};

loadEvents();

client.once(Events.ClientReady, () => {
    console.log('起動完了!');

    client.user.setStatus(PresenceUpdateStatus.Online);
    client.user.setActivity({
        name: '三沢市を応援中！',
        type: ActivityType.Custom,
    });
});

client.login(token);
