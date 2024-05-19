const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'snipe',
    aliases: [],
    category: 'info',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You must have \`Manage Message\` permissions to run this command.`
                        )
                ]
            })
        }
        client.on('messageDelete', async (deletedMessage) => {
            if (deletedMessage.author.bot) return

            const snipeData = {
                content: deletedMessage.content || 'No content available',
                author: deletedMessage.author.tag || 'Unknown Author',
                timestamp: deletedMessage.createdTimestamp,
                imageUrl:
                    deletedMessage.attachments.size > 0
                        ? deletedMessage.attachments.first().url
                        : null
            }

            await client.data.set(
                `snipe_${deletedMessage.guild.id}_${deletedMessage.channel.id}`,
                snipeData
            )
        })

        let snipe = await client.data.get(
            `snipe_${message.guild.id}_${message.channel.id}`
        )

        if (!snipe) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`There Are No Deleted Messages`)
                ]
            })
        }

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Sniped Message')
            .addFields([
                {
                    name: `Author`,
                    value: `${snipe.author}`
                },
                {
                    name: `Timestamp`,
                    value: `${new Date(snipe.timestamp).toLocaleString()}`
                }
            ])
            .setDescription(`Content\n${snipe.content}`)
        embed.setImage(snipe.imageUrl)

        message.channel.send({ embeds: [embed] })
    }
}
