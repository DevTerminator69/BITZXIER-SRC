const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'ping',
    category: 'info',
    premium: true,
    run: async (client, message, args) => {
        let ping = client.ws.ping
        let text = ''
        if (ping >= 0 && ping <= 20) {
            text = 'Very fast!'
        } else if (ping >= 21 && ping <= 30) {
            text = 'Fast!'
        } else if (ping >= 31 && ping <= 50) {
            text = 'Good!'
        } else if (ping >= 51 && ping <= 70) {
            text = 'Moderate!'
        } else if (ping >= 71 && ping <= 100) {
            text = 'Slow!'
        } else {
            text = 'Very Slow!'
        }
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setAuthor({
                        name: `${client.ws.ping}ms Pong!`,
                        iconURL: `${message.member.user.displayAvatarURL({
                            dynamic: true
                        })}`
                    })
                    .setColor(client.color)
                    .setFooter({
                        text: `Respond Speed: ${text}`,
                        iconURL: client.user.displayAvatarURL()
                    })
            ]
        })
    }
}
