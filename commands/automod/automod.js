const { MessageEmbed } = require('discord.js')
let enable = `<:Satxler_DNo:1218049715799851058><:Satxler_Eyes:1218049874596204594>`
let disable = `<:Satxler_Dyes:1218050682305773639><:Satxler_Eno:1218051067389153290>`
let protect = `<:Satxler_Ant:1222728518732091403>`
let hii = `<:Hii:1220745498621771776>`
const wait = require('wait')

module.exports = {
    name: 'automod',
    aliases: [],
    cooldown: 5,
    category: 'automod',
    subcommand: ['bypass user', 'bypass role','bypass channel'],
    premium: true,
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color)

     if (message.guild.memberCount < 30) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Your Server Doesn't Meet My 30 Member Criteria`
                        )
                ]
            })
        }
        let own = message.author.id == message.guild.ownerId
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    embed
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
                    embed
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
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }

        let prefix = message.guild.prefix || '&' // Correct way to define default prefix

        const option = args[0]

        const ricky = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addFields([
                {
                    name: `\`Autmod\``,
                    value: `**Shows the current page.**`
                },
                {
                    name: `\`Automod bypass role add <role>\``,
                    value: `**Adds the provided role to Automod Bypass Configuration.**`
                },
                {
                    name: `\`Automod bypass role remove <role>\``,
                    value: `**Remove the provided role to Automod Bypass Configuration.**`
                },
                {
                    name: `\`Automod bypass role list\``,
                    value: `**Shows the Automod role Bypass list.**`
                },
                {
                    name: `\`Automod bypass role reset\``,
                    value: `**Reset the Automod Bypass role Configuration**‎ `
                },
                {
                    name: `\`Automod bypass user add <user>\``,
                    value: `**Adds the provided user to Automod Bypass user Configuration.**`
                },
                {
                    name: `\`Automod bypass user remove <user>\``,
                    value: `**Remove the provided user to Automod Bypass user Configuration.**`
                },
                {
                    name: `\`Automod bypass user list\``,
                    value: `**Shows the Automod Bypass user list.**`
                },
                {
                    name: `\`Automod bypass user reset\``,
                    value: `**Reset the Automod bypass user Configuration**`
                },
                {
                    name: `\`Automod bypass channel add <channel>\``,
                    value: `**Adds the provided channel to Automod Bypass channel Configuration.**`
                },
                {
                    name: `\`Automod bypass channel remove <channel>\``,
                    value: `**Remove the provided channel to Automod Bypass channel Configuration.**`
                },
                {
                    name: `\`Automod bypass channel list\``,
                    value: `**Shows the Automod Bypass channel list.**`
                },
                {
                    name: `\`Automod bypass channel reset\``,
                    value: `**Reset the Automod bypass channel Configuration**\n‎ `
                }
            ])

        switch (option) {
            case undefined:
                return message.channel.send({ embeds: [ricky] })
                break
            case 'bypass':
                if (!args[1]) {
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setAuthor({
                                    name: message.author.tag,
                                    iconURL: message.author.displayAvatarURL({
                                        dynamic: true
                                    })
                                })
                                .setTitle('AUTOMOD BYPASS OPTIONS')
                                .addFields([
                                    {
                                        name: `\`Autmod\``,
                                        value: `**Shows the current page.**`
                                    },
                                    {
                                        name: `\`Automod bypass role add <role>\``,
                                        value: `**Adds the provided role to Automod Bypass Configuration.**`
                                    },
                                    {
                                        name: `\`Automod bypass role remove <role>\``,
                                        value: `**Remove the provided role to Automod Bypass Configuration.**`
                                    },
                                    {
                                        name: `\`Automod bypass role list\``,
                                        value: `**Shows the Automod role Bypass list.**`
                                    },
                                    {
                                        name: `\`Automod bypass role reset\``,
                                        value: `**Reset the Automod Bypass role Configuration**‎ `
                                    },
                                    {
                                        name: `\`Automod bypass user add <user>\``,
                                        value: `**Adds the provided user to Automod Bypass user Configuration.**`
                                    },
                                    {
                                        name: `\`Automod bypass user remove <user>\``,
                                        value: `**Remove the provided user to Automod Bypass user Configuration.**`
                                    },
                                    {
                                        name: `\`Automod bypass user list\``,
                                        value: `**Shows the Automod Bypass user list.**`
                                    },
                                    {
                                        name: `\`Automod bypass user reset\``,
                                        value: `**Reset the Automod bypass user Configuration**\n‎ `
                                    },
                                    {
                                        name: `\`Automod bypass channel add <channel>\``,
                                        value: `**Adds the provided channel to Automod Bypass channel Configuration.**`
                                    },
                                    {
                                        name: `\`Automod bypass channel remove <channel>\``,
                                        value: `**Remove the provided channel to Automod Bypass channel Configuration.**`
                                    },
                                    {
                                        name: `\`Automod bypass channel list\``,
                                        value: `**Shows the Automod Bypass channel list.**`
                                    },
                                    {
                                        name: `\`Automod bypass channel reset\``,
                                        value: `**Reset the Automod bypass channel Configuration**\n‎ `
                                    }
                                ])
                        ]
                    })
                } else if (args[1] === 'role') {
                    if (!args[2]) {
                        await message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setAuthor({
                                        name: message.author.tag,
                                        iconURL:
                                            message.author.displayAvatarURL({
                                                dynamic: true
                                            })
                                    })
                                    .setTitle('AUTOMOD BYPASS ROLE OPTIONS')
                                    .addFields([
                                        {
                                            name: `\`Bypass Role\``,
                                            value: `**Shows the current page.**`
                                        },
                                        {
                                            name: `\`Automod bypass role add <role>\``,
                                            value: `**Adds the provided role to Automod Bypass Configuration.**`
                                        },
                                        {
                                            name: `\`Automod bypass role remove <role>\``,
                                            value: `**Remove the provided role to Automod Bypass Configuration.**`
                                        },
                                        {
                                            name: `\`Automod bypass role list\``,
                                            value: `**Shows the Automod role Bypass list.**`
                                        },
                                        {
                                            name: `\`Automod bypass role reset\``,
                                            value: `**Reset the Automod Bypass role Configuration**\n‎ `
                                        }
                                    ])
                            ]
                        })
                    }
                    if (args[2] === 'add') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                let role =
                                    getRoleFromMention(message, args[3]) ||
                                    message.guild.roles.cache.get(args[3])

                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                                                     { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                if (role) {
                                    if (!data.role.includes(role.id)) {
                                        data.role.push(role.id)
                                        await client.db.set(
                                            `automodbp_${message.guild.id}`,
                                            data
                                        )
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `${client.emoji.tick} | Success! The ${role} role has been successfully added to my Automod bypass role list.`
                                                    )
                                            ]
                                        })
                                    } else {
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `${client.emoji.cross} | Oops! It appears that ${role} is already in my Automod bypass role list.`
                                                    )
                                            ]
                                        })
                                    }
                                }
                                if (!role) {
                                    await message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(client.color)
                                                .setAuthor({
                                                    name: message.author.tag,
                                                    iconURL:
                                                        message.author.displayAvatarURL(
                                                            { dynamic: true }
                                                        )
                                                })
                                                .setTitle(
                                                    'AUTOMOD BYPASS ROLE OPTIONS'
                                                )
                                                .addFields([
                                                    {
                                                        name: `\`Bypass Role\``,
                                                        value: `**Shows the current page.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass role add <role>\``,
                                                        value: `**Adds the provided role to Automod Bypass Configuration.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass role remove <role>\``,
                                                        value: `**Remove the provided role to Automod Bypass Configuration.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass role list\``,
                                                        value: `**Shows the Automod role Bypass list.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass role reset\``,
                                                        value: `**Reset the Automod Bypass role Configuration**\n‎ `
                                                    }
                                                ])
                                        ]
                                    })
                                }
                            })
                    }
                    if (args[2] === 'remove') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                let role =
                                    getRoleFromMention(message, args[3]) ||
                                    message.guild.roles.cache.get(args[3])
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                                                     { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod Bypass module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                if (role) {
                                    if (data.role.includes(role.id)) {
                                        data.role = data.role.filter(
                                            (ok) => ok != role.id
                                        )
                                        await client.db?.set(
                                            `automodbp_${message.guild.id}`,
                                            data
                                        )
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `${client.emoji.tick} | Success! The ${role} has been successfully removed from my Automod role bypass list.`
                                                    )
                                            ]
                                        })
                                    } else {
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        ` ${client.emoji.cross} | Oops! It appears that the ${role} is not on my Automod role bypass list.`
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
                    if (args[2] === 'list') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                                                     { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod bypass module and enjoy using your server hassle-free! 🚀`
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
                                        .setTitle(
                                            `**AUTOMOD BYPASS ROLE LIST**`
                                        )
                                        .setDescription(
                                            `${mentions.join('\n')}`
                                        )
                                    message.channel.send({
                                        embeds: [ownerlist]
                                    })
                                } else {
                                    return message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(client.color)
                                                .setDescription(
                                                    `${client.emoji.cross} | Oops! It seems like there's no designated Automod bypass role set up in this server. No worries, though! You can easily configure one to enhance your experience.`
                                                )
                                        ]
                                    })
                                }
                            })
                    }
                    if (args[2] === 'reset') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                                                     { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod bypass module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                if (data.role.length > 0) {
                                    const existingData = await client.db.get(
                                        `automodbp_${message.guild.id}`
                                    )
                                    if (existingData) {
                                        existingData.role = []
                                        await client.db.set(
                                            `automodbp_${message.guild.id}`,
                                            existingData
                                        )
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `✨ Success! The server's Automod bypass role list has been cleared. You're all set to customize and optimize your experience now.`
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
                                                    `🌐 Whoops! It looks like no Automod bypass role has been set up in this server yet. No worries, though! You can easily configure one to tailor your experience and enhance server functionality.`
                                                )
                                        ]
                                    })
                                }
                            })
                    }
                } else if (args[1] === 'user' || args[1] === 'member') {
                    if (!args[2]) {
                        await message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setAuthor({
                                        name: message.author.tag,
                                        iconURL:
                                            message.author.displayAvatarURL({
                                                dynamic: true
                                            })
                                    })
                                    .setTitle('AUTOMOD BYPASS USER OPTIONS')
                                    .addFields([
                                        {
                                            name: `\`Bypass User\``,
                                            value: `**Shows the current page.**`
                                        },
                                        {
                                            name: `\`Automod bypass user add <user>\``,
                                            value: `**Adds the provided user to Automod Bypass Configuration.**`
                                        },
                                        {
                                            name: `\`Automod bypass user remove <user>\``,
                                            value: `**Remove the provided user to Automod Bypass Configuration.**`
                                        },
                                        {
                                            name: `\`Automod bypass user list\``,
                                            value: `**Shows the Automod user Bypass list.**`
                                        },
                                        {
                                            name: `\`Automod bypass user reset\``,
                                            value: `**Reset the Automod Bypass user Configuration**\n‎ `
                                        }
                                    ])
                            ]
                        })
                    }
                    if (args[2] === 'add') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                const user =
                                    getUserFromMention(message, args[3]) ||
                                    client.users.cache.get(args[3])
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                                                     { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod Bypass module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                if (user) {
                                    if (!data.user.includes(user.id)) {
                                        data.user.push(user.id)
                                        await client.db.set(
                                            `automodbp_${message.guild.id}`,
                                            data
                                        )
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `${client.emoji.tick} | Success! The ${user} role has been successfully added to my Automod bypass user list.`
                                                    )
                                            ]
                                        })
                                    } else {
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `${client.emoji.cross} | Oops! It appears that ${user} is already in my Automod bypass user list.`
                                                    )
                                            ]
                                        })
                                    }
                                }
                                if (!user) {
                                    await message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(client.color)
                                                .setAuthor({
                                                    name: message.author.tag,
                                                    iconURL:
                                                        message.author.displayAvatarURL(
                                                            { dynamic: true }
                                                        )
                                                })
                                                .setTitle(
                                                    'AUTOMOD BYPASS USER OPTIONS'
                                                )
                                                .addFields([
                                                    {
                                                        name: `\`Bypass User\``,
                                                        value: `**Shows the current page.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass user add <user>\``,
                                                        value: `**Adds the provided user to Automod Bypass Configuration.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass user remove <user>\``,
                                                        value: `**Remove the provided user to Automod Bypass Configuration.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass user list\``,
                                                        value: `**Shows the Automod user Bypass list.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass user reset\``,
                                                        value: `**Reset the Automod Bypass user Configuration**\n‎ `
                                                    }
                                                ])
                                        ]
                                    })
                                }
                            })
                    }
                    if (args[2] === 'remove') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                const user =
                                    getUserFromMention(message, args[3]) ||
                                    client.users.cache.get(args[3])
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                                                     { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod bypass module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                if (user) {
                                    if (data.user.includes(user.id)) {
                                        data.user = data.user.filter(
                                            (ok) => ok != user.id
                                        )
                                        await client.db?.set(
                                            `automodbp_${message.guild.id}`,
                                            data
                                        )
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `${client.emoji.tick} | Success! The ${user} has been successfully removed from my Automod bypass user list.`
                                                    )
                                            ]
                                        })
                                    } else {
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        ` ${client.emoji.cross} | Oops! It appears that the ${user} is not on my Automod bypass user list.`
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
                                                    ` ${client.emoji.cross} | Oops! It seems there was an issue. Please make sure to provide a valid user.`
                                                )
                                        ]
                                    })
                                }
                            })
                    }
                    if (args[2] === 'list') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                                                     { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod bypass module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                const user = data.user
                                const mentions = []
                                let i = 1
                                if (user.length !== 0) {
                                    user.forEach((channelId) =>
                                        mentions.push(
                                            `\`${i++}\` <@${channelId}> \`${channelId}\``
                                        )
                                    )
                                    const ownerlist = new MessageEmbed()
                                        .setColor(client.color)
                                        .setTitle(
                                            `**AUTOMOD BYPASS ROLE LIST**`
                                        )
                                        .setDescription(
                                            `${mentions.join('\n')}`
                                        )
                                    message.channel.send({
                                        embeds: [ownerlist]
                                    })
                                } else {
                                    return message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(client.color)
                                                .setDescription(
                                                    `${client.emoji.cross} | Oops! It seems like there's no designated Automod bypass role set up in this server. No worries, though! You can easily configure one to enhance your experience.`
                                                )
                                        ]
                                    })
                                }
                            })
                    }
                    if (args[2] === 'reset') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                                                     { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod bypass module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                if (data.user.length > 0) {
                                    const existingData = await client.db.get(
                                        `automodbp_${message.guild.id}`
                                    )
                                    if (existingData) {
                                        existingData.user = []
                                        await client.db.set(
                                            `automodbp_${message.guild.id}`,
                                            existingData
                                        )
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `✨ Success! The server's Automod bypass user list has been cleared. You're all set to customize and optimize your experience now.`
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
                                                    `🌐 Whoops! It looks like no Automod bypass user has been set up in this server yet. No worries, though! You can easily configure one to tailor your experience and enhance server functionality.`
                                                )
                                        ]
                                    })
                                }
                            })
                    }
                } else if (args[1] === 'channel') {
                    if (!args[2]) {
                        await message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setAuthor({
                                        name: message.author.tag,
                                        iconURL:
                                            message.author.displayAvatarURL({
                                                dynamic: true
                                            })
                                    })
                                    .setTitle('AUTOMOD BYPASS CHANNEL OPTIONS')
                                    .addFields([
                                        {
                                            name: `\`Bypass Channel\``,
                                            value: `**Shows the current page.**`
                                        },
                                        {
                                            name: `\`Automod bypass Channel add <Channel>\``,
                                            value: `**Adds the provided Channel to Automod Bypass Configuration.**`
                                        },
                                        {
                                            name: `\`Automod bypass Channel remove <Channel>\``,
                                            value: `**Remove the provided Channel to Automod Bypass Configuration.**`
                                        },
                                        {
                                            name: `\`Automod bypass Channel list\``,
                                            value: `**Shows the Automod Channel Bypass list.**`
                                        },
                                        {
                                            name: `\`Automod bypass Channel reset\``,
                                            value: `**Reset the Automod Bypass Channel Configuration**\n‎ `
                                        }
                                    ])
                            ]
                        })
                    }
                    if (args[2] === 'add') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                let channel =
                                    getChannelFromMention(message, args[3]) ||
                                    message.guild.roles.cache.get(args[3])

                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                        { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                if (channel) {
                                    if (!data.channel.includes(channel.id)) {
                                        data.channel.push(channel.id)
                                        await client.db.set(
                                            `automodbp_${message.guild.id}`,
                                            data
                                        )
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `${client.emoji.tick} | Success! The ${channel} channel has been successfully added to my Automod bypass channel list.`
                                                    )
                                            ]
                                        })
                                    } else {
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `${client.emoji.cross} | Oops! It appears that ${channel} is already in my Automod bypass channel list.`
                                                    )
                                            ]
                                        })
                                    }
                                }
                                if (!channel) {
                                    await message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(client.color)
                                                .setAuthor({
                                                    name: message.author.tag,
                                                    iconURL:
                                                        message.author.displayAvatarURL(
                                                            { dynamic: true }
                                                        )
                                                })
                                                .setTitle(
                                                    'AUTOMOD BYPASS ROLE OPTIONS'
                                                )
                                                .addFields([
                                                    {
                                                        name: `\`Bypass channel\``,
                                                        value: `**Shows the current page.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass channel add <channel>\``,
                                                        value: `**Adds the provided channel to Automod Bypass Configuration.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass channel remove <channel>\``,
                                                        value: `**Remove the provided channel to Automod Bypass Configuration.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass channel list\``,
                                                        value: `**Shows the Automod channel Bypass list.**`
                                                    },
                                                    {
                                                        name: `\`Automod bypass channel reset\``,
                                                        value: `**Reset the Automod Bypass channel Configuration**\n‎ `
                                                    }
                                                ])
                                        ]
                                    })
                                }
                            })
                    }
                    if (args[2] === 'remove') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                let channel =
                                    getChannelFromMention(message, args[3]) ||
                                    message.guild.roles.cache.get(args[3])
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                        { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod Bypass module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                if (channel) {
                                    if (data.channel.includes(channel.id)) {
                                        data.channel = data.channel.filter(
                                            (ok) => ok != channel.id
                                        )
                                        await client.db?.set(
                                            `automodbp_${message.guild.id}`,
                                            data
                                        )
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `${client.emoji.tick} | Success! The ${channel} has been successfully removed from my Automod channel bypass list.`
                                                    )
                                            ]
                                        })
                                    } else {
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        ` ${client.emoji.cross} | Oops! It appears that the ${channel} is not on my Automod channel bypass list.`
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
                    if (args[2] === 'list') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                        { user: [], role: [], channel: []}
                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod bypass module and enjoy using your server hassle-free! 🚀`
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
                                        .setTitle(
                                            `**AUTOMOD BYPASS CHANNEL LIST**`
                                        )
                                        .setDescription(
                                            `${mentions.join('\n')}`
                                        )
                                    message.channel.send({
                                        embeds: [ownerlist]
                                    })
                                } else {
                                    return message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(client.color)
                                                .setDescription(
                                                    `${client.emoji.cross} | Oops! It seems like there's no designated Automod bypass channel set up in this server. No worries, though! You can easily configure one to enhance your experience.`
                                                )
                                        ]
                                    })
                                }
                            })
                    }
                    if (args[2] === 'reset') {
                        await client.db
                            .get(`automodbp_${message.guild.id}`)
                            .then(async (data) => {
                                if (!data) {
                                    await client.db.set(
                                        `automodbp_${message.guild.id}`,
                                                                     { user: [], role: [], channel: []}                                    )
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
                                            `Great news! Your server is now configured perfectly. Feel free to use Automod bypass module and enjoy using your server hassle-free! 🚀`
                                        )
                                    return await msg.edit({ embeds: [rickog] })
                                }
                                if (data.channel.length > 0) {
                                    const existingData = await client.db.get(
                                        `automodbp_${message.guild.id}`
                                    )
                                    if (existingData) {
                                        existingData.channel = []
                                        await client.db.set(
                                            `automodbp_${message.guild.id}`,
                                            existingData
                                        )
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor(client.color)
                                                    .setDescription(
                                                        `✨ Success! The server's Automod bypass channel list has been cleared. You're all set to customize and optimize your experience now.`
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
                                                    `🌐 Whoops! It looks like no Automod bypass channel has been set up in this server yet. No worries, though! You can easily configure one to tailor your experience and enhance server functionality.`
                                                )
                                        ]
                                    })
                                }
                            })
                    }
                }
                break
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
function getUserFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<@!?(\d+)>$/)
    if (!matches) return null

    const id = matches[1]
    return message.client.users.cache.get(id)
}
function getChannelFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<#(\d+)>$/); 
    if (!matches) return null;

    const channelId = matches[1];
    return message.guild.channels.cache.get(channelId);
}
