const {
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('ボタンでの認証')
        .addRoleOption((option) =>
            option
                .setName('role')
                .setDescription('ロールを選択')
                .setRequired(true)
        ),

    async execute(interaction) {
        const role = interaction.options.getRole('role');

        const button = new ButtonBuilder()
            .setCustomId(`verify_button_${role.id}`)
            .setLabel('認証')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        const embed = new EmbedBuilder()
            .setTitle('認証')
            .setDescription(`ボタンを押すことで認証を行います`);

        await interaction.channel.send({ embeds: [embed], components: [row] });

        await interaction.reply({
            content: '認証パネルを設置しました',
            ephemeral: true,
        });
    },
};
