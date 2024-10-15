const { EmbedBuilder } = require('discord.js');
const { channelId } = require('../../config.json');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
            const logChannel = await newMember.guild.channels.fetch(channelId);
            const embed = new EmbedBuilder()
                .setTitle('ユーザーがタイムアウトされました。')
                .setColor(0x0000ff)
                .addFields(
                    { name: 'ユーザー名', value: newMember.user.tag },
                    { name: 'ユーザーID', value: newMember.user.id },
                    { name: 'タイムアウトの終了', value: newMember.communicationDisabledUntil ? newMember.communicationDisabledUntil.toUTCString() : 'なし' }
                )
                .setTimestamp();

            if (logChannel) {
                logChannel.send({ embeds: [embed] });
            }
        }
    },
};
