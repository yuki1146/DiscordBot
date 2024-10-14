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
const { token, clientId, guildId, channelId } = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commands = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'))
    .map((file) => {
        const command = require(`./commands/${file}`);
        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            return command.data.toJSON();
        } else {
            console.error(`Invalid command format in ${file}:`, command);
            return null; // 無効なコマンドはnullを返す
        }
    })
    .filter(command => command !== null);


// Bot起動時に指定したチャンネルにメッセージを送信
client.once(Events.ClientReady, async () => {
    console.log('起動完了!');

    const channel = await client.channels.fetch(channelId);
    if (channel) {
        await channel.send('Botが起動しました！');
    }

    client.user.setStatus(PresenceUpdateStatus.Online);
    client.user.setActivity({
        name: '~~起動中~~',
        type: ActivityType.Custom,
    });
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

client.login(token);
