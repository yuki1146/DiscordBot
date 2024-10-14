const { EmbedBuilder } = require('discord.js');
const { channelId } = require('../../config.json');

module.exports = {
    name: 'guildBanAdd',
    async execute(ban) {
        const logChannel = await ban.guild.channels.fetch(channelId);
        const embed = new EmbedBuilder()
            .setTitle('ユーザーがBANされました')
            .setColor(0xff0000)
            .addFields(
                { name: 'ユーザー名', value: ban.user.tag },
                { name: 'ユーザーID', value: ban.user.id }
            )
            .setTimestamp();

        if (logChannel) {
            logChannel.send({ embeds: [embed] });
        }
    },
};
