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

// ここで client を作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// index.jsの冒頭に追加
const banLog = require('./events/moderation/banLog');
const kickLog = require('./events/moderation/kickLog');
const timeoutLog = require('./events/moderation/timeoutLog');
const messageDeleteLog = require('./events/moderation/messageDeleteLog');
const messageEditLog = require('./events/moderation/messageEditLog');

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
            return command.data;
        } else {
            console.error(`Invalid command format in ${file}:`, command);
            return null;
        }
    })
    .filter(command => command !== null);

// Bot起動時に指定したチャンネルにメッセージを送信
client.once(Events.ClientReady, async () => {
    console.log('Botの起動完了！');
    
    const channel = await client.channels.fetch(channelId);
    if (channel) {
        await channel.send('Botが起動しました！');
        console.log('起動メッセージを送信しました。');
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

        console.log('コマンドの登録完了！');
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

loadEvents();

// Pingコマンドの追加
client.commands.set('ping', {
    data: {
        name: 'ping',
        description: 'WebSocket PingとAPI Endpoint Pingを表示します。',
    },
    async execute(interaction) {
        const apiPingStart = Date.now();  // API Pingの計測開始
        await interaction.deferReply();   // 応答を遅らせる

        // WebSocket Pingの取得
        const wsPing = interaction.client.ws.ping;

        // API Pingの計測終了
        const apiPingEnd = Date.now();
        const apiPing = apiPingEnd - apiPingStart;

        // Ping応答を送信
        await interaction.editReply(`🏓 WebSocket Ping: \`${wsPing}ms\`\n⌛ API Endpoint Ping: \`${apiPing}ms\``);
    },
});

client.login(token);
