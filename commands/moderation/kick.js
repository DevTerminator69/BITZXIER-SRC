const { Message, Client, MessageEmbed } = require('discord.js')
module.exports = {
    name: 'kick',
    aliases: [],
    category: 'mod',
    premium: true,
    run: async (client, message, args) => {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`Kick Members\` permissions to use this command.`
                        )
                ]
            })
        }
        let isown = message.author.id == message.guild.ownerId
        let user = await getUserFromMention(message, args[0])
        if (!user) {
            try {
                user = await message.guild.members.fetch(args[0])
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | Please Provide Valid user ID or Mention Member.`
                            )
                    ]
                })
            }
        }
        let rea = args.slice(1).join(' ') || 'No Reason Provided'
        rea = `${message.author.tag} (${message.author.id}) | ` + rea
        const kaalo = new MessageEmbed()
            .setDescription(`${client.emoji.cross} | User Not Found`)
            .setColor(client.color)
        const teddy = new MessageEmbed()
            .setDescription(`${client.emoji.cross} | Mention the user first`)
            .setColor(client.color)
        if (!user) return message.channel.send({ embeds: [teddy] })
        if (user === undefined)
            return message.channel.send({ embeds: [kaalo] })

        if (user.id === client.user.id)
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You can't kick me.`
                        )
                ]
            })

        if (user.id === message.guild.ownerId)
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I can't kick the owner of this server.`
                        )
                ]
            })
        if (!client.util.hasHigher(message.member) && !isown) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }

        if (!user.kickable) {
            const embed = new MessageEmbed()
                .setDescription(
                    `${client.emoji.cross} |  My highest role is below **<@${user.id}>** `
                )
                .setColor(client.color)
            return message.channel.send({ embeds: [embed] })
        }
        const banmess = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
                `You Have Been kicked From ${message.guild.name} \nExecutor : ${message.author.tag} \nReason : \`${rea}\``
            )
            .setColor(client.color)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))

        await message.guild.members.kick(user.id, rea).catch((err) => null)
        await user.send({ embeds: [banmess] }).catch((err) => null)

        const done = new MessageEmbed()
            .setDescription(
                `${client.emoji.tick} | Successfully kicked **${user.user.tag}** from the server.`
            )
            .setColor(client.color)
        return message.channel.send({ embeds: [done] })
    }
}

function getUserFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<@!?(\d+)>$/)
    if (!matches) return null

    const id = matches[1]
    return message.guild.members.fetch(id)
}
