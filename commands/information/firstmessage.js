const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'firstmsg',
    aliases: ['firstmessage'],
    category: 'info',
    run: async (client, message, args) => {
        const fetchMessages = await message.channel.messages.fetch({
            after: 1,
            limit: 1
        })
        const msg = fetchMessages.first()

        const embed = new MessageEmbed()
            .setTitle(`First Messsage in ${message.guild.name}`)
            .setURL(msg.url)
            .setDescription('Content: ' + msg.content)
            .addField('Author', `${msg.author}`)
            .addField('Message ID', `${msg.id}`)
            .addField('Created At', `${message.createdAt.toLocaleDateString()}`)
            .setColor(client.color)
        message.channel.send({ embeds: [embed] })
    }
}
