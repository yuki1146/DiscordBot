const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('アンケートを作成します')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('質問を入力してください')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('options')
                .setDescription('選択肢をカンマ区切りで入力してください')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const options = interaction.options.getString('options').split(',');
        if (options.length < 2 || options.length > 10) {
            return interaction.reply({ content: '選択肢は2つ以上、10個以下で入力してください。', ephemeral: true });
        }
        const pollEmbed = {
            title: question,
            description: options.map((option, index) => `${index + 1}. ${option}`).join('\n'),
            footer: { text: 'リアクションで投票してください！' }
        };
        try {
            // インタラクションの応答を送信
            await interaction.reply({ content: 'アンケートを作成します...', ephemeral: true });
            const pollMessage = await interaction.channel.send({ embeds: [pollEmbed] });
            for (let i = 0; i < options.length; i++) {
                await pollMessage.react(`${i + 1}️⃣`);
            }
            // アンケート作成完了メッセージ
            await interaction.followUp({ content: 'アンケートを作成しました！', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    },
};
