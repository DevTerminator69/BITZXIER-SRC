const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'membercount',
    aliases: ['mc'],
    category: 'info',
    premium: true,

    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setTitle(`Members`)
            .setDescription(`${message.guild.memberCount}`)
            .setTimestamp()

        message.channel.send({ embeds: [embed] })
    }
}
