const {
    Message,
    Client,
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require('discord.js')

module.exports = {
    name: 'servericon',
    aliases: ['serverav', 'serveravatar'],
    category: 'info',
    premium: true,

    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setDescription(
                `[\`PNG\`](${message.guild.iconURL({
                    dynamic: true,
                    size: 2048,
                    format: 'png'
                })}) | [\`JPG\`](${message.guild.iconURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                })}) | [\`WEBP\`](${message.guild.iconURL({
                    dynamic: true,
                    size: 2048,
                    format: 'webp'
                })})`
            )
            .setColor(client.color)
            .setImage(message.guild.iconURL({ dynamic: true, size: 2048 }))

        message.channel.send({ embeds: [embed] })
    }
}
