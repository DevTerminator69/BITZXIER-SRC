const { Message, Client, MessageEmbed } = require('discord.js')
module.exports = {
    name: 'kick',
    category: 'mod',
    premium: true,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
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
        const user =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])
        let rea = args.slice(1).join(' ') || 'No Reason Provided'
        rea = `${message.author.tag} (${message.author.id}) | ` + rea
        const emisai = new MessageEmbed()
            .setDescription(`${client.emoji.cross} | User Not Found`)
            .setColor(client.color)
        const saileon = new MessageEmbed()
            .setDescription(`${client.emoji.cross} | Mention the user first`)
            .setColor(client.color)
        if (!user) return message.channel.send({ embeds: [saileon] })
        if (user === undefined)
            return message.channel.send({ embeds: [emisai] })

        if (user.id === client.user.id)
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | If You Kick Me Then Who Will Protect Your Server Dumb!?`
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
        if (
            message.guild.me.roles.highest.position <=
                user.roles.highest.position &&
            !isown
        ) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | My highest role is below than <@${user.id}>.`
                        )
                ]
            })
        }
        if (
            message.member.roles.highest.position <=
                user.roles.highest.position &&
            !isown
        ) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than <@${user.id}> to use this command.`
                        )
                ]
            })
        }

        if (!user.kickable) {
            const embed = new MessageEmbed()
                .setDescription(
                    `${client.emoji.cross} | I can't kick this user.`
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
            await  user.send({ embeds: [banmess] }).catch((e) => null)
            await  user.kick({ reason: rea })
        const done = new MessageEmbed()
            .setDescription(
                `${client.emoji.tick} | Successfully kicked **${user.user.tag}** from the server.`
            )
            .setColor(client.color)
        return message.channel.send({ embeds: [done] })
    }
}
