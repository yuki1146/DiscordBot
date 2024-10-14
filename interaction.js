const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            try {
                const command = client.commands.get(interaction.commandName);
                if (!command) {
                    await interaction.reply({ content: 'そのコマンドは見つかりませんでした', ephemeral: true });
                    return;
                }
                await command.execute(interaction, client);
            } catch (error) {
                console.error('Interaction command error:', error);
                await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            const roleId = interaction.customId.split('_')[2]; // ボタンIDからロールIDを取得
            const role = interaction.guild.roles.cache.get(roleId); // ギルドからロールを取得
            const member = interaction.member;

            if (!role) {
                return interaction.reply({
                    content: 'ロールが見つかりませんでした',
                    ephemeral: true,
                });
            }

            try {
                if (member.roles.cache.has(roleId)) {
                    await interaction.reply({
                        content: '既にそのロールを持っています。',
                        ephemeral: true,
                    });
                    return;
                }

                await member.roles.add(role); // ロールを付与

                await interaction.reply({
                    content: '認証しました',
                    ephemeral: true,
                });
            } catch (error) {
                console.error('ロールの付与でエラー:', error);
                await interaction.reply({
                    content: 'ロールの付与に失敗しました',
                    ephemeral: true,
                });
            }
        }
    },
};
