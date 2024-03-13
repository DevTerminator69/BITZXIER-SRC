const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

// Command
module.exports = {
    name: 'invite',
    aliases: ['i'],
    category: 'info',
    premium: true,

    run: async (client, message, args) => {
        const button = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('Invite Me')
                .setStyle('LINK')
                .setURL(
                    `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
                )
        )

        // Sending
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `[Click here to invite me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`
                    )
            ],
            components: [button]
        })
    }
}
