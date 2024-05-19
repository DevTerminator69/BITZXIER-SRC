const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js')

module.exports = {
    name: 'vcmove',
    category: 'voice',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MOVE_MEMBERS')) {
            const error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Move members\` permission to use this command.`
                )
            return message.channel.send({ embeds: [error] })
        }
        if (!message.guild.me.permissions.has('MOVE_MEMBERS')) {
            const error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `I must have \`Move members\` permission to use this command.`
                )
            return message.channel.send({ embeds: [error] })
        }
        let user =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])
        let voicechannel =
            message.member.voice.channel ||
            message.guild.channels.cache.get(args[1])
        if (!voicechannel) {
            return message.reply('You must be in vc first !')
        }
        if (!voicechannel !== 'GUILD_VOICE') {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`Please Provide valid voice channel`)
                ]
            })
        }
        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`Please mention someone who is in vc`)
                ]
            })
        }
        if (user) {
            if (!user.voice.channel) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `Please mention someone who is in vc`
                            )
                    ]
                })
            }
            await user.voice.setChannel(message.member.voice.channel)
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`DRagged `)
                ]
            })
        }
    }
}
