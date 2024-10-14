const { EmbedBuilder } = require('discord.js');
const { channelId } = require('../../config.json');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        if (oldMessage.content !== newMessage.content) {
            const logChannel = await oldMessage.guild.channels.fetch(channelId);
            const embed = new EmbedBuilder()
                .setTitle('メッセージが編集されました')
                .setColor(0xffff00)
                .addFields(
                    { name: 'メッセージ送信者', value: oldMessage.author.tag || '不明' },
                    { name: '編集前のメッセージ', value: oldMessage.content || '不明' },
                    { name: '編集後のメッセージ', value: newMessage.content || '不明' }
                )
                .setTimestamp();

            if (logChannel) {
                logChannel.send({ embeds: [embed] });
            }
        }
    },
};
