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

                // コマンドの実行
                await command.execute(interaction, client);
            } catch (error) {
                console.error('Interaction command error:', error);

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
                }
            }
        } else if (interaction.isButton()) {
            const roleId = interaction.customId.split('_')[2];
            const role = interaction.guild.roles.cache.get(roleId);
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

                await member.roles.add(role);

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '認証しました', ephemeral: true });
                } else {
                    await interaction.reply({ content: '認証しました', ephemeral: true });
                }
            } catch (error) {
                console.error('ロールの付与でエラー:', error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'ロールの付与に失敗しました', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'ロールの付与に失敗しました', ephemeral: true });
                }
            }
        }
    },
};
