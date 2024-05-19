const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js')

module.exports = {
    name: 'vcrole',
    aliases: ['invcrole'],
    category: 'voice',
    premium: true,
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You must have \`Administration\` perms to run this command.`
                        )
                ]
            })
        }
        const invc = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addFields([
                { name: `\`vcrole\``, value: `**Shows the current page.**` },
                {
                    name: `\`vcrole humans set <role>\``,
                    value: `**set role to vcrole human configuration.**`
                },
                {
                    name: `\`vcrole bot set <role>\``,
                    value: `**set role to vcrole bot configuration.**`
                },
                {
                    name: `\`vcrole view \``,
                    value: `**view vcrole configuration.**`
                },
                {
                    name: `\`vcrole reset\``,
                    value: `**reset vcrole configuration**\n‎ `
                }
            ])
            .setFooter({
                text: `Note: At the time of providing Vc-Role when someone joins the vc, I'll ignore the role if its having Dangerous Perms.`,
                iconURL: client.user.displayAvatarURL()
            })
        let option = args[0]
        if (!option) {
            message.channel.send({ embeds: [invc] })
        } else if (option === 'humans' || option === 'humans') {
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
                                `Please provide valid role arguments: \`set\`.`
                            )
                    ]
                })
            }
            if (
                args[1].toLowerCase() === 'set' ||
                args[1].toLowerCase() === 'sets' ||
                args[1].toLowerCase() === 'add'
            ) {
                await client.db
                    .get(`vcroles_${message.guild.id}`)
                    .then(async (data) => {
                        let role =
                            getRoleFromMention(message, args[2]) ||
                            message.guild.roles.cache.get(args[2])
                        if (!data) {
                            await client.db.set(`vcroles_${message.guild.id}`, {
                                vcrole: null,
                                vcrolebot: null
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
                                    `Great news! Your server is now configured perfectly. Feel free to use vcrole module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        if (role) {
                            if (
                                role &&
                                !role.permissions.has(
                                    'ADMINISTRATOR',
                                    'KICK_MEMBERS',
                                    'BAN_MEMBERS',
                                    'MANAGE_CHANNELS',
                                    'MANAGE_GUILD',
                                    'MENTION_EVERYONE',
                                    'MANAGE_ROLES',
                                    'MANAGE_WEBHOOKS'
                                )
                            ) {
                                await client.db.set(
                                    `vcroles_${message.guild.id}`,
                                    {
                                        vcrole: role.id,
                                        vcrolebot: data ? data.vcrolebot : null
                                    }
                                )
                                message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.tick} | successfully added ${role} as vcrole human.!`
                                            )
                                    ]
                                })
                            } else {
                                message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.cross} | this role is having dangerous permissions.!`
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
                                            `${client.emoji.cross} | please provide a valid role mention or id to set as vcrole!`
                                        )
                                ]
                            })
                        }
                        if (
                            role.position >=
                            message.guild.me.roles.highest.position
                        ) {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `${client.emoji.cross} | I can't provide this role as my highest role is either below or equal to the provided role.`
                                        )
                                ]
                            })
                        }
                        if (role.managed) {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `${client.emoji.cross} | you cannot add any integrated role in My vcrole.! `
                                        )
                                ]
                            })
                        }
                    })
            }
        } else if (option === 'bot' || option === 'bots') {
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
                                `Please provide valid role arguments: \`set\`.`
                            )
                    ]
                })
            }
            if (
                args[1].toLowerCase() === 'set' ||
                args[1].toLowerCase() === 'sets' ||
                args[1].toLowerCase() === 'add'
            ) {
                await client.db
                    .get(`vcroles_${message.guild.id}`)
                    .then(async (data) => {
                        let role =
                            getRoleFromMention(message, args[2]) ||
                            message.guild.roles.cache.get(args[2])
                        if (!data) {
                            await client.db.set(`vcroles_${message.guild.id}`, {
                                vcrole: null,
                                vcrolebot: null
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
                                    `Great news! Your server is now configured perfectly. Feel free to use vcrole module and enjoy using your server hassle-free! 🚀`
                                )
                            return await msg.edit({ embeds: [rickog] })
                        }
                        if (role) {
                            if (
                                role &&
                                !role.permissions.has(
                                    'ADMINISTRATOR',
                                    'KICK_MEMBERS',
                                    'BAN_MEMBERS',
                                    'MANAGE_CHANNELS',
                                    'MANAGE_GUILD',
                                    'MENTION_EVERYONE',
                                    'MANAGE_ROLES',
                                    'MANAGE_WEBHOOKS'
                                )
                            ) {
                                await client.db.set(
                                    `vcroles_${message.guild.id}`,
                                    {
                                        vcrole: data ? data.vcrole : null,
                                        vcrolebot: role.id
                                    }
                                )
                                message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.tick} | successfully added ${role} as vcrole bot.!`
                                            )
                                    ]
                                })
                            } else {
                                message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${client.emoji.cross} | this role is having dangerous permissions.!`
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
                                            `${client.emoji.cross} | please provide a valid role mention or id to set as vcrole!`
                                        )
                                ]
                            })
                        }
                        if (
                            role.position >=
                            message.guild.me.roles.highest.position
                        ) {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `${client.emoji.cross} | I can't provide this role as my highest role is either below or equal to the provided role.`
                                        )
                                ]
                            })
                        }
                        if (role.managed) {
                            return message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(client.color)
                                        .setDescription(
                                            `${client.emoji.cross} | you cannot add any integrated role in My vcrole.! `
                                        )
                                ]
                            })
                        }
                    })
            }
        } else if (
            option === 'show' ||
            option === 'view' ||
            option === 'config'
        ) {
            await client.db
                .get(`vcroles_${message.guild.id}`)
                .then(async (data) => {
                    if (!data) {
                        await client.db.set(`vcroles_${message.guild.id}`, {
                            vcrole: null,
                            vcrolebot: null
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
                                `Great news! Your server is now configured perfectly. Feel free to use vcrole module and enjoy using your server hassle-free! 🚀`
                            )
                        return await msg.edit({ embeds: [rickog] })
                    }
                    if (!data.vcrole && !data.vcrolebot) {
                        return message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | No vcrole is configured.!`
                                    )
                            ]
                        })
                    } else {
                        const invc = new MessageEmbed()
                            .setColor(client.color)
                            .setAuthor(
                                message.author.tag,
                                message.author.displayAvatarURL({
                                    dynamic: true
                                })
                            )
                            .setTitle('Vc role Configuration')
                            .setThumbnail(
                                message.guild.iconURL({ dynamic: true })
                            )
                        if (data.vcrole)
                            invc.addFields({
                                name: `Vc Role Human`,
                                value: `<@&${data.vcrole}>`
                            })
                        if (data.vcrolebot)
                            invc.addFields({
                                name: `Vc Role Bot`,
                                value: `<@&${data.vcrolebot}>`
                            })
                        if (!data.vcrole)
                            invc.addFields({
                                name: `Vc Role Human`,
                                value: `\`NOT SET\``
                            })
                        if (!data.vcrolebot)
                            invc.addFields({
                                name: `Vc Role Bot`,
                                value: `\`NOT SET\``
                            })

                                .setTimestamp()
                        await message.channel.send({ embeds: [invc] })
                    }
                })
        } else if (option === 'reset') {
            await client.db
                .get(`vcroles_${message.guild.id}`)
                .then(async (data) => {
                    if (!data) {
                        await client.db.set(`vcroles_${message.guild.id}`, {
                            vcrole: null,
                            vcrolebot: null
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
                                `Great news! Your server is now configured perfectly. Feel free to use vcrole module and enjoy using your server hassle-free! 🚀`
                            )
                        return await msg.edit({ embeds: [rickog] })
                    }
                    if (!data.vcrole && !data.vcrolebot) {
                        message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.cross} | there is no vcrole in this server.!`
                                    )
                            ]
                        })
                    } else if (
                        data
                            ? data.vcrole
                            : null && data
                              ? data.vcrolebot
                              : null
                    ) {
                        await client.db.set(`vcroles_${message.guild.id}`, {
                            vcrole: null,
                            vcrolebot: null
                        })
                        message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${client.emoji.tick} | successfully disabled vcrole configuration.!`
                                    )
                            ]
                        })
                    }
                })
        }

        /*



if (option.toLowerCase() === 'set') {
    const role = getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1])
    if(!role) {
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | please provide a valid role mention or id to set as vcrole!`
                    )
            ]
        })  
      }
      if (role.position >= message.guild.me.roles.highest.position) {
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | I can't provide this role as my highest role is either below or equal to the provided role.`
                        )
            ]
        })
    }
      if (role.managed) {
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | you cannot add any integrated role in My vcrole.! `
                    )
            ]
        })
    }

    if (role && !role.permissions.has('ADMINISTRATOR','KICK_MEMBERS','BAN_MEMBERS','MANAGE_CHANNELS','MANAGE_GUILD','MENTION_EVERYONE','MANAGE_ROLES','MANAGE_WEBHOOKS')) {
        await client.db.set(`vcroles_${message.guild.id}`, {
            vcrole : role.id
        })
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.tick} | successfully added ${role} as vcrole.!`
                    )
            ]
        })
    } else {
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `${client.emoji.cross} | this role is having dangerous permissions.!`
                    )
            ]
        })
    }

    } else if (option.toLowerCase() === 'reset') {
        const data = await client.db.get(`vcroles_${message.guild.id}`)
        if (!data) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | there is no vcrole in this server.!`
                        )
                ]
            })
        } else if (data) {
            await client.db.set(`vcroles_${message.guild.id}`, null)
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | successfully disabled vcrole configuration.!`
                        )
                ]
            })
        }
    } else if (option.toLowerCase() === 'view') {
        const data = await client.db.get(`vcroles_${message.guild.id}`)
        if (!data?.vcrole)
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | No vcrole is configured.!`
                        )
                ]
            })
        const role = new MessageEmbed()
            .setColor(client.color)
            .setDescription(`<@&${data.vcrole}> is configured As vcroles.! `)
        message.channel.send({ embeds: [role] })
    }*/
    }
}
function getRoleFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<@&(\d+)>$/) // Using <@&> for role mention
    if (!matches) return null

    const roleId = matches[1]
    return message.guild.roles.cache.get(roleId)
}
