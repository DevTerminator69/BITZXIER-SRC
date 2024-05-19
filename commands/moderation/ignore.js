const {
    MessageEmbed,
    Message,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    Client
} = require('discord.js')

module.exports = {
    name: 'ignore',
    aliases: [],
    category: 'mod',
    premium: true,
    run: async (client, message, args) => {
        let option = args[0]
        let prefix = message.guild.prefix || '&'
        let own = message.author.id === message.guild.ownerId
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`Administrator\` permissions to use this command.`
                        )
                ]
            })
        }
        if (!message.guild.me.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I don't have \`Administrator\` permissions to execute this command.`
                        )
                ]
            })
        }
        if (
            !own &&
            message.member.roles.highest.position <=
                message.guild.me.roles.highest.position
        ) {
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
        if (!option) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .addFields([
                            {
                                name: `\`Ignore\``,
                                value: `**Shows the current page.**`
                            },
                            {
                                name: `\`ignore channel add <channel>\``,
                                value: `**Adds the provided channel to Ignore Configuration.**`
                            },
                            {
                                name: `\`ignore channel remove <channel>\``,
                                value: `**Remove the provided channel from Ignore Configuration.**`
                            },
                            {
                                name: `\`ignore channel list\``,
                                value: `**Shows the Ignore Channel list.**`
                            },
                            {
                                name: `\`ignore channel reset\``,
                                value: `**Reset the Ignore Channel Configuration**‎ `
                            },
                            {
                                name: `\`ignore bypass add <role>\``,
                                value: `**Adds the provided role to Ignore Bypass Configuration.**`
                            },
                            {
                                name: `\`ignore bypass remove <role>\``,
                                value: `**Remove the provided role to Ignore Bypass Configuration.**`
                            },
                            {
                                name: `\`ignore bypass list\``,
                                value: `**Shows the Ignore Bypass list.**`
                            },
                            {
                                name: `\`ignore bypass reset\``,
                                value: `**Reset the Ignore Configuration**\n‎ `
                            }
                        ])
                ]
            })
        } else if (option === 'channel') {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setAuthor({
                                name: message.author.tag,
                                iconURL: message.author.displayAvatarURL({
                                    dynamic: true
                                })
                            })
                            .setDescription(
                                `Please provide valid channel arguments: \`add\`, \`remove\`, \`list\`,\`reset\`.`
                            )
                    ]
                })
            }
            if (args[1] === 'add') {
                await client.db
                    .get(`ignore_${message.guild.id}`)
                    .then(async (data) => {
                        let channel =
                            getChannelFromMention(message, args[2]) ||
                            message.guild.channels.cache.get(args[2])
                        if (!data) {
                            await client.db.set(`ignore_${message.guild.id}`, {
                                channel: [],
                                role: []
                            })
                            let msg = await message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `Please wait, setting up configuration for your server.`
                                        )
                                ]
                            })
                            await client.util.sleep(2000)
                            const rickog = new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `Great news! Your server is now configured perfectly. Feel free to use ignore module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        if (channel) {
                            if (!data.channel.includes(channel.id)) {
                                data.channel.push(channel.id)
                                await client.db.set(
                                    `ignore_${message.guild.id}`,
                                    data
                                )
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.tick} | Success! ${channel} has been successfully added to my ignore list.`
                                            )
                                    ]
                                })
                            } else {
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.cross} | Oh no! It looks like ${channel} is already in my ignore list.`
                                            )
                                    ]
                                })
                            }
                        }
                        if (!channel) {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `${client.emoji.cross} | Oops! It seems there was an issue. Please make sure to provide a valid channel for the ignore list.`
                                        )
                                ]
                            })
                        }
                    })
            }

            if (args[1] === 'remove') {
                await client.db
                    .get(`ignore_${message.guild.id}`)
                    .then(async (data) => {
                        let channel =
                            getChannelFromMention(message, args[2]) ||
                            message.guild.channels.cache.get(args[2])
                        if (!data) {
                            await client.db.set(`ignore_${message.guild.id}`, {
                                channel: [],
                                role: []
                            })
                            let msg = await message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `Please wait, setting up configuration for your server. ⌛`
                                        )
                                ]
                            })
                            await client.util.sleep(2000)
                            const rickog = new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `Great news! Your server is now configured perfectly. Feel free to use ignore module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        if (channel) {
                            if (data.channel.includes(channel.id)) {
                                data.channel = data.channel.filter(
                                    (ok) => ok != channel.id
                                )
                                await client.db?.set(
                                    `ignore_${message.guild.id}`,
                                    data
                                )
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.tick} | Success! ${channel} has been successfully removed from my ignore list.`
                                            )
                                    ]
                                })
                            } else {
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                ` ${client.emoji.cross} | Oops! It appears that ${channel} is not on my ignore list.`
                                            )
                                    ]
                                })
                            }
                        }
                        if (!channel) {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            ` ${client.emoji.cross} | Oops! It seems there was an issue. Please make sure to provide a valid channel.`
                                        )
                                ]
                            })
                        }
                    })
            }

            if (args[1] === 'list') {
                await client.db
                    .get(`ignore_${message.guild.id}`)
                    .then(async (data) => {
                        if (!data) {
                            await client.db.set(`ignore_${message.guild.id}`, {
                                channel: [],
                                role: []
                            })
                            let msg = await message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `Please wait, setting up configuration for your server.`
                                        )
                                ]
                            })
                            await client.util.sleep(2000)
                            const rickog = new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `Great news! Your server is now configured perfectly. Feel free to use ignore module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        const channel = data.channel
                        const mentions = []
                        let i = 1
                        if (channel.length !== 0) {
                            channel.forEach((channelId) =>
                                mentions.push(
                                    `\`${i++}\` <#${channelId}> \`${channelId}\``
                                )
                            )
                            const ownerlist = new MessageEmbed()
                                .setColor(client.color)
                                .setTitle(`**IGNORE CHANNEL LIST**`)
                                .setDescription(`${mentions.join('\n')}`)
                            message.channel.send({ embeds: [ownerlist] })
                        } else {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `${client.emoji.cross} | Oops! It seems like there's no designated ignore channel set up in this server. No worries, though! You can easily configure one to enhance your experience.`
                                        )
                                ]
                            })
                        }
                    })
            }
            if (args[1] === 'reset') {
                await client.db
                    .get(`ignore_${message.guild.id}`)
                    .then(async (data) => {
                        if (!data) {
                            await client.db.set(`ignore_${message.guild.id}`, {
                                channel: [],
                                role: []
                            })
                            let msg = await message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `Please wait, setting up configuration for your server.`
                                        )
                                ]
                            })
                            await client.util.sleep(2000)
                            const rickog = new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `Great news! Your server is now configured perfectly. Feel free to use ignore module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        if (data.channel.length > 0) {
                            const existingData = await client.db.get(
                                `ignore_${message.guild.id}`
                            )
                            if (existingData) {
                                existingData.channel = []
                                await client.db.set(
                                    `ignore_${message.guild.id}`,
                                    existingData
                                )
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `✨ Success! The server's ignore channel list has been cleared. You're all set to customize and optimize your experience now.`
                                            )
                                    ]
                                })
                            }
                        } else {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `🌐 Whoops! It looks like no ignore channel has been set up in this server yet. No worries, though! You can easily configure one to tailor your experience and enhance server functionality.`
                                        )
                                ]
                            })
                        }
                    })
            }
        } else if (option === 'bypass') {
            if (!args[1]) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setAuthor({
                                name: message.author.tag,
                                iconURL: message.author.displayAvatarURL({
                                    dynamic: true
                                })
                            })
                            .setDescription(
                                `Please provide valid role arguments: \`add\`, \`remove\`, \`list\`,\`reset\`.`
                            )
                    ]
                })
            }
            if (args[1] === 'add') {
                await client.db
                    .get(`ignore_${message.guild.id}`)
                    .then(async (data) => {
                        let role =
                            getRoleFromMention(message, args[2]) ||
                            message.guild.roles.cache.get(args[2])
                        if (!data) {
                            await client.db.set(`ignore_${message.guild.id}`, {
                                channel: [],
                                role: []
                            })
                            let msg = await message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `Please wait, setting up configuration for your server.`
                                        )
                                ]
                            })
                            await client.util.sleep(2000)
                            const rickog = new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `Great news! Your server is now configured perfectly. Feel free to use ignore module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        if (role) {
                            if (!data.role.includes(role.id)) {
                                data.role.push(role.id)
                                await client.db.set(
                                    `ignore_${message.guild.id}`,
                                    data
                                )
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.tick} | Success! The ${role} role has been successfully added to my ignore bypass list.`
                                            )
                                    ]
                                })
                            } else {
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.cross} | Oops! It appears that ${role} is already in my ignore bypass list.`
                                            )
                                    ]
                                })
                            }
                        }
                        if (!role) {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `${client.emoji.cross} | Oops! It seems there was an issue. Please ensure you've provided a valid role for the ignore bypass list.`
                                        )
                                ]
                            })
                        }
                    })
            }
            if (args[1] === 'remove') {
                await client.db
                    .get(`ignore_${message.guild.id}`)
                    .then(async (data) => {
                        let role =
                            getRoleFromMention(message, args[2]) ||
                            message.guild.roles.cache.get(args[2])
                        if (!data) {
                            await client.db.set(`ignore_${message.guild.id}`, {
                                channel: [],
                                role: []
                            })
                            let msg = await message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `Please wait, setting up configuration for your server. ⌛`
                                        )
                                ]
                            })
                            await client.util.sleep(2000)
                            const rickog = new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `Great news! Your server is now configured perfectly. Feel free to use ignore module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        if (role) {
                            if (data.role.includes(role.id)) {
                                data.role = data.role.filter(
                                    (ok) => ok != role.id
                                )
                                await client.db?.set(
                                    `ignore_${message.guild.id}`,
                                    data
                                )
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.tick} | Success! The ${role} has been successfully removed from my ignore bypass list.`
                                            )
                                    ]
                                })
                            } else {
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                ` ${client.emoji.cross} | Oops! It appears that the ${role} is not on my ignore bypass list.`
                                            )
                                    ]
                                })
                            }
                        }
                        if (!role) {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            ` ${client.emoji.cross} | Oops! It seems there was an issue. Please make sure to provide a valid role.`
                                        )
                                ]
                            })
                        }
                    })
            }
            if (args[1] === 'list') {
                await client.db
                    .get(`ignore_${message.guild.id}`)
                    .then(async (data) => {
                        if (!data) {
                            await client.db.set(`ignore_${message.guild.id}`, {
                                channel: [],
                                role: []
                            })
                            let msg = await message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `Please wait, setting up configuration for your server.`
                                        )
                                ]
                            })
                            await client.util.sleep(2000)
                            const rickog = new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `Great news! Your server is now configured perfectly. Feel free to use ignore module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        const role = data.role
                        const mentions = []
                        let i = 1
                        if (role.length !== 0) {
                            role.forEach((channelId) =>
                                mentions.push(
                                    `\`${i++}\` <@&${channelId}> \`${channelId}\``
                                )
                            )
                            const ownerlist = new MessageEmbed()
                                .setColor(client.color)
                                .setTitle(`**IGNORE BYPASS LIST**`)
                                .setDescription(`${mentions.join('\n')}`)
                            message.channel.send({ embeds: [ownerlist] })
                        } else {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `${client.emoji.cross} | Oops! It seems like there's no designated ignore bypass role set up in this server. No worries, though! You can easily configure one to enhance your experience.`
                                        )
                                ]
                            })
                        }
                    })
            }
            if (args[1] === 'reset') {
                await client.db
                    .get(`ignore_${message.guild.id}`)
                    .then(async (data) => {
                        if (!data) {
                            await client.db.set(`ignore_${message.guild.id}`, {
                                channel: [],
                                role: []
                            })
                            let msg = await message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `Please wait, setting up configuration for your server.`
                                        )
                                ]
                            })
                            await client.util.sleep(2000)
                            const rickog = new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `Great news! Your server is now configured perfectly. Feel free to use ignore module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        if (data.role.length > 0) {
                            const existingData = await client.db.get(
                                `ignore_${message.guild.id}`
                            )
                            if (existingData) {
                                existingData.role = []
                                await client.db.set(
                                    `ignore_${message.guild.id}`,
                                    existingData
                                )
                                return message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `✨ Success! The server's ignore bypass role list has been cleared. You're all set to customize and optimize your experience now.`
                                            )
                                    ]
                                })
                            }
                        } else {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `🌐 Whoops! It looks like no ignore bypass role has been set up in this server yet. No worries, though! You can easily configure one to tailor your experience and enhance server functionality.`
                                        )
                                ]
                            })
                        }
                    })
            }
        }
    }
}

function getRoleFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<@&(\d+)>$/)
    if (!matches) return null

    const roleId = matches[1]
    return message.guild.roles.cache.get(roleId)
}
function getChannelFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<#(\d+)>$/)
    if (!matches) return null

    const channelId = matches[1]
    return message.guild.channels.cache.get(channelId)
}
