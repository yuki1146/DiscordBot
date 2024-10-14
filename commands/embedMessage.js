const {
    EmbedBuilder,
    SlashCommandBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embedmessage')
        .setDescription('埋め込みメッセージを送信します')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('埋め込みメッセージのタイトル')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('埋め込みメッセージの内容')
                .setRequired(true)),

    async execute(interaction) {
        // コマンドオプションからタイトルとメッセージを取得
        const title = interaction.options.getString('title');
        const messageContent = interaction.options.getString('message');

        // 応答を保留
        await interaction.deferReply(); // 応答を遅延させる

        // 埋め込みメッセージを作成
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(title)
            .setDescription(messageContent)
            .setTimestamp();

        try {
            // 埋め込みメッセージを送信
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('埋め込みメッセージの送信中にエラーが発生しました:', error);
            await interaction.editReply({ content: '埋め込みメッセージの送信中にエラーが発生しました。', ephemeral: true });
        }
    },
};
