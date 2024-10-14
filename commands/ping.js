const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('WebSocket PingとAPI Endpoint Pingを表示します。'),
    async execute(interaction) {
        const apiPingStart = Date.now();  // API Pingの計測開始
        await interaction.deferReply();   // 遅延応答を設定（応答を待つ間のエラーを防ぐ）
        
        // WebSocket Pingの取得
        const wsPing = interaction.client.ws.ping;

        // API Pingの計測完了
        const apiPingEnd = Date.now();
        const apiPing = apiPingEnd - apiPingStart;

        // 応答を送信
        await interaction.editReply(`🏓 WebSocket Ping: \`${wsPing}ms\`\n⌛ API Endpoint Ping: \`${apiPing}ms\``);
    },
};
