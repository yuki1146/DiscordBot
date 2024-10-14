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

// index.jsの冒頭に追加
const banLog = require('./events/banLog');
const kickLog = require('./events/kickLog');
const timeoutLog = require('./events/timeoutLog');
const messageDeleteLog = require('./events/messageDeleteLog');
const messageEditLog = require('./events/messageEditLog');

// イベントの読み込みの部分にログイベントを追加
client.on('guildBanAdd', (ban) => banLog.execute(ban));
client.on('guildMemberRemove', (member) => kickLog.execute(member));
client.on('guildMemberUpdate', (oldMember, newMember) => timeoutLog.execute(oldMember, newMember));
client.on('messageDelete', (message) => messageDeleteLog.execute(message));
client.on('messageUpdate', (oldMessage, newMessage) => messageEditLog.execute(oldMessage, newMessage));

client.commands = new Collection();

// コマンドの読み込み
const commands = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'))
    .map((file) => {
        const command = require(`./commands/${file}`);
        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            return command.data; // toJSON()を削除して直接返す
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

// REST APIを用いてスラッシュコマンドを登録
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

// イベントの読み込み
const loadEvents = () => {
    const eventFiles = fs
        .readdirSync('./events')
        .filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.name) {
            client.on(event.name, (...args) => event.execute(...args, client));
        } else {
            console.error(`Invalid event format in ${file}:`, event);
        }
    }
};

client.login(token);
