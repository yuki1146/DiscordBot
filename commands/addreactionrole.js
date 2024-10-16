const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addreactionrole')
        .setDescription('リアクションロールを設定します')
        .addStringOption(option => 
            option.setName('messageid')
                .setDescription('リアクションを追加するメッセージのID')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('付与/剥奪するロール')
                .setRequired(true)),
    async execute(interaction) {
        const messageId = interaction.options.getString('messageid');
        const role = interaction.options.getRole('role');
        const channel = interaction.channel;
        let message;

        // メッセージを取得してリアクションを追加
        try {
            message = await channel.messages.fetch(messageId);
            if (!message) {
                throw new Error('メッセージが見つかりませんでした');
            }
            await message.react('⭕');
            await message.react('❌');

            // リアクションロール設定完了メッセージ
            await interaction.reply({ content: `リアクションロールが設定されました！メッセージID: ${messageId}`, ephemeral: true });
        } catch (error) {
            console.error('リアクションロールの設定エラー:', error);
            await interaction.reply({ content: 'リアクションロールの設定に失敗しました。指定されたメッセージIDが存在しない可能性があります。', ephemeral: true });
            return;
        }

        // リアクションの処理
        const filter = (reaction, user) => ['⭕', '❌'].includes(reaction.emoji.name) && !user.bot;

        const collector = message.createReactionCollector({ filter, dispose: true });

        collector.on('collect', async (reaction, user) => {
            const member = reaction.message.guild.members.cache.get(user.id);

            try {
                if (reaction.emoji.name === '⭕') {
                    await member.roles.add(role);
                    await reaction.users.remove(user.id); // リアクションを外す

                    // ロール付与メッセージを、押した人のみが見える形で送信
                    await interaction.followUp({
                        content: `✅ あなたにロールが付与されました: ${role.name}`,
                        ephemeral: true, // 実行者にのみ見えるメッセージ
                    });
                } else if (reaction.emoji.name === '❌') {
                    await member.roles.remove(role);
                    await reaction.users.remove(user.id); // リアクションを外す

                    // ロール剥奪メッセージを、押した人のみが見える形で送信
                    await interaction.followUp({
                        content: `❌ あなたのロールが剥奪されました: ${role.name}`,
                        ephemeral: true, // 実行者にのみ見えるメッセージ
                    });
                }
            } catch (error) {
                console.error(`ロールの変更エラー: ${error}`);
            }
        });
    },
};
