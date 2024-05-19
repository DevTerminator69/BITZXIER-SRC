const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'mediachannel',
    aliases: ['media'],
    category: 'mod',
    premium: true,
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`MANAGE SERVER\` permissions to use this command.`
                        )
                ]
            });
        }
        if (!message.guild.me.permissions.has('ADMINISTRATOR')) { 
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I don't have \`Administrator\` permissions to execute this command.`
                        )
                ]
            })
        }

        if (!client.util.hasHigher(message.member)) {
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
        let prefix = '&' || message.guild.prefix
        const option = args[0]

        const media = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Media (4) **__`)

            .addFields([
                {
                    name: `__**media**__`,
                    value: `Configures the media only channels !`
                },
                {
                    name: `__**media Set**__`,
                    value: `Setup media only channel in server`
                },
                {
                    name: `__**media reset**__`,
                    value: `Disable media only channels configured in server`
                },
                {
                    name: `__**media View**__`,
                    value: `Shows the media only channels`
                }
            ])
        if (!option) {
            message.channel.send({ embeds: [media] })
        } else if (option.toLowerCase() === 'set') {
            const channel =
                getChannelFromMention(message, args[1]) ||
                message.guild.channels.cache.get(args[1])

            if (!channel)
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | Oops! It seems there was an issue. Please make sure to provide a valid channel for the media configuration.`
                            )
                    ]
                })
            if (channel.type === 'GUILD_VOICE') {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | You cannot add any voice channels as media channel `
                            )
                    ]
                })
            }
            if (channel) {
                await client.db.set(`mediachannel_${message.guild.id}`, {
                    channel: channel.id
                })
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.tick} | Successfully Added ${channel} As Media Only Channel`
                            )
                    ]
                })
            }
        } else if (option.toLowerCase() === 'reset') {
            const data = await client.db.get(`mediachannel_${message.guild.id}`)
            if (!data) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.tick} | There Is No Media Only Channel Configuration In This Server.!`
                            )
                    ]
                })
            } else if (data) {
                await client.db.set(`mediachannel_${message.guild.id}`, null)
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.tick} | Successfully Disabled Media Only Configuration.!`
                            )
                    ]
                })
            }
        } else if (option.toLowerCase() === 'view') {
            const data = await client.db.get(`mediachannel_${message.guild.id}`)
            if (!data?.channel)
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | No Media Only configured is Set.!`
                            )
                    ]
                })
            const whitelisted = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `Current media only configured channel is <#${data.channel}>`
                )
            message.channel.send({ embeds: [whitelisted] })
        }
    }
}

function getChannelFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<#(\d+)>$/)
    if (!matches) return null

    const channelId = matches[1]
    return message.guild.channels.cache.get(channelId)
}
