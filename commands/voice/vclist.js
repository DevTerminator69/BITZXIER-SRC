const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js')

module.exports = {
    name: 'vclist',
    category: 'voice',
    premium: true,

    run: async (client, message, args) => {
        if (!message.member.voice.channel) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You must be connected to a voice channel first.`
                        )
                ]
            })
        }
        let members = message.guild.members.cache
            .filter(
                (m) =>
                    m.voice?.channel?.id == message.member?.voice?.channel?.id
            )
            .map((m) => `${m.user.tag} | <@${m.user.id}>`)
            .join(`\n`)
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(members)
                    .setTitle(
                        `**Users in ${message.member.voice.channel.name} - ${message.member.voice.channel.members.size}**`
                    )
            ]
        })
    }
}
