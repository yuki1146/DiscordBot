const { EmbedBuilder } = require('discord.js');
const { channelId } = require('../../config.json');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const logChannel = await member.guild.channels.fetch(channelId);
        const embed = new EmbedBuilder()
            .setTitle('ユーザーがKickされました')
            .setColor(0xffa500)
            .addFields(
                { name: 'ユーザー名', value: member.user.tag },
                { name: 'ユーザーID', value: member.user.id }
            )
            .setTimestamp();

        if (logChannel) {
            logChannel.send({ embeds: [embed] });
        }
    },
};
