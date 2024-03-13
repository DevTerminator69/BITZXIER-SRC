const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const moment = require('moment')
const os = require('os')
module.exports = {
    name: 'stats',
    category: 'info',
    aliases: ['botinfo', 'bi'],
    usage: 'stats',
    run: async (client, message, args) => {
        let button = new MessageButton()
            .setLabel('Team Info')
            .setCustomId('team')
            .setStyle('SECONDARY')
        let button1 = new MessageButton()
            .setLabel('General Info')
            .setCustomId('general')
            .setStyle('SECONDARY')
            .setDisabled(true)
        let button2 = new MessageButton()
            .setLabel('System Info')
            .setCustomId('system')
            .setStyle('SECONDARY')
        let button3 = new MessageButton()
            .setLabel('Partners ')
            .setCustomId('partners')
            .setStyle('SECONDARY')
        const row = new MessageActionRow().addComponents([
            button,
            button1,
            button2,
            button3
        ])
        const uptime = Math.round(Date.now() - client.uptime)
        let guilds1 = client.guilds.cache.size
        let member1 = client.guilds.cache.reduce((x, y) => x + y.memberCount, 0)
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({
                name: 'BITZXIER Informations',
                iconURL: (
                    await client.guilds
                        .fetch('873228243757596672')
                        .catch(() => null)
                )?.members?.cache
                    ?.get('1180425876798701588')
                    ?.user?.displayAvatarURL({ dynamic: true })
            })
            .setDescription(
                `**__General Informations__**\nBot's Mention: <@!${
                    client.user.id
                }>\nBot's Tag: ${
                    client.user.tag
                }\nBot's Version: 1.0.0\nTotal Servers: ${guilds1}\nTotal Users: ${member1} (${
                    client.users.cache.size
                } Cached)\nTotal Channels: ${
                    client.channels.cache.size
                }\nLast Rebooted: ${moment(uptime).fromNow()}`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({
                text: `Requested By ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
        let msg = await message.channel.send(
            { embeds: [embed], components: [row] },
            message
        )

        const collector = msg.createMessageComponentCollector({
            filter: (i) => i.user && i.isButton(),
            time: 60000
        })
        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id)
                return i.reply({
                    content: "> This isn't for you.",
                    ephemeral: true
                })
            if (i.isButton()) {
                if (i.customId == 'partners') {
                    i.deferUpdate()
                    const em = new MessageEmbed()
                        .setColor(client.color)
                        .setAuthor({
                            name: "BITZXIER Partner's",
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setDescription(
                            `RudraCloud was born in 2023 with the idea of providing the latest generation products to customers. We provide **Virtual Private Servers**, **Panels**, Virtual Dedicated Servers and Dedicated Servers [click here to see website](https://rudracloud.xyz/)\n[discord server](https://discord.gg/Nhxx5MZ59B)`
                        )
                        .setFooter({
                            text: `© Powered By RudraCloud`,
                            iconURL:
                                'https://cdn.discordapp.com/icons/1089579780850077858/a_5111711e34f6d58323baf36c0b29b773.gif'
                        })
                        .setImage(
                            `https://media.discordapp.net/attachments/1152257911033168042/1171351266149015592/standard_1.gif?width=585&height=75`
                        )
                    button = button.setDisabled(false)
                    button1 = button1.setDisabled(false)
                    button2 = button2.setDisabled(false)
                    button3 = button3.setDisabled(true)
                    const row1 = new MessageActionRow().addComponents([
                        button,
                        button1,
                        button2,
                        button3
                    ])
                    if (msg)
                        return msg.edit(
                            { embeds: [em], components: [row1] },
                            message,
                            msg
                        )
                }
                if (i.customId == 'team') {
                    i.deferUpdate()
                    let status = {
                        dnd: '<:dnd:1181484398097485834>',
                        idle: '<:idle:1181484312265228439>',
                        online: '<:online:1181479231872565361>',
                        offline: '<:offline:1181479232015188019>'
                    }
                    const em = new MessageEmbed()
                        .setDescription(
                            `**__Developers__**\n[\`1\`] ${
                                status[
                                    client.guilds.cache
                                        .get('873228243757596672')
                                        ?.members?.cache?.get(
                                            '1180425876798701588'
                                        )?.presence?.status || 'offline'
                                ]
                            }  [Terminator </>](https://discord.gg/users/1180425876798701588)\n\n**__Core Team__**\n[\`1\`] ${
                                status[
                                    client.guilds.cache
                                        .get('873228243757596672')
                                        ?.members?.cache?.get(
                                            '259176352748404736'
                                        )?.presence?.status || 'offline'
                                ]
                            }  [sumittt.](https://discord.gg/users/259176352748404736)\n\n**__Contributors __**\n[\`1\`] ${
                                status[
                                    client.guilds.cache
                                        .get('873228243757596672')
                                        ?.members?.cache?.get(
                                            '1111192187628163102'
                                        )?.presence?.status || 'offline'
                                ]
                            }  [alone.fyy](https://discord.gg/users/1111192187628163102)`
                        )
                        .setColor(client.color)
                        .setAuthor({
                            name: 'BITZXIER Informations',
                            iconURL: client.guilds.cache
                                .get('873228243757596672')
                                ?.members?.cache?.get('1180425876798701588')
                                ?.user?.displayAvatarURL({ dynamic: true })
                        })
                        .setFooter({
                            text: `Requested By ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setThumbnail(client.user.displayAvatarURL())
                    button = button.setDisabled(true)
                    button1 = button1.setDisabled(false)
                    button2 = button2.setDisabled(false)
                    button3 = button3.setDisabled(false)
                    const row1 = new MessageActionRow().addComponents([
                        button,
                        button1,
                        button2,
                        button3
                    ])
                    if (msg)
                        return msg.edit(
                            { embeds: [em], components: [row1] },
                            message,
                            msg
                        )
                }
                if (i.customId == 'general') {
                    i.deferUpdate()
                    let member = client.guilds.cache.reduce(
                        (x, y) => x + y.memberCount,
                        0
                    )
                    if (member >= 1000 && member < 1000000)
                        member = (member / 1000).toFixed(1) + 'k'
                    else if (member >= 1000000)
                        member = (member / 1000000).toFixed(1) + 'm'
                    else member1 = member1
                    let guilds = client.guilds.cache.size
                    const embed = new MessageEmbed()
                        .setColor(client.color)
                        .setAuthor({
                            name: 'BITZXIER Informations',
                            iconURL: client.guilds.cache
                                .get('873228243757596672')
                                ?.members?.cache?.get('1180425876798701588')
                                ?.user?.displayAvatarURL({ dynamic: true })
                        })
                        .setDescription(
                            `**__General Informations__**\nBot's Mention: <@!${
                                client.user.id
                            }>\nBot's Tag: ${client.user.tag}\nBot's Version: ${
                               `1.0.0`
                            }\nTotal Servers: ${guilds}\nTotal Users: ${member} (${
                                client.users.cache.size
                            } Cached)\nTotal Channels: ${
                                client.channels.cache.size
                            }\nLast Rebooted: ${moment(uptime).fromNow()}`
                        )
                        .setThumbnail(client.user.displayAvatarURL())
                        .setFooter({
                            text: `Requested By ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                    button = button.setDisabled(false)
                    button1 = button1.setDisabled(true)
                    button2 = button2.setDisabled(false)
                    button3 = button3.setDisabled(false)
                    const row1 = new MessageActionRow().addComponents([
                        button,
                        button1,
                        button2,
                        button3
                    ])
                    if (msg)
                        return msg.edit(
                            { embeds: [embed], components: [row1] },
                            message,
                            msg
                        )
                }
                if (i.customId == 'system') {
                    i.deferUpdate()
                    if (msg)
                        msg.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setAuthor({
                                        name: 'BITZXIER Informations',
                                        iconURL: client.guilds.cache
                                            .get('873228243757596672')
                                            ?.members?.cache?.get(
                                                '1180425876798701588'
                                            )
                                            ?.user?.displayAvatarURL({
                                                dynamic: true
                                            })
                                    })
                                    .setFooter({
                                        text: `Requested By ${message.author.tag}`,
                                        iconURL:
                                            message.author.displayAvatarURL({
                                                dynamic: true
                                            })
                                    })
                                    .setDescription(
                                        '<:bitzxier_mainrole:1181290802022977576> | **Fetching** all the **resources**...'
                                    )
                            ]
                        })
                    const totalMemoryBytes = os.totalmem()
                    const cpuCount = os.cpus().length
                    const freeMemoryBytes = os.freemem()
                    const memoryUsageBytes = totalMemoryBytes - freeMemoryBytes

                    let totalMemoryGB = totalMemoryBytes / (1024 * 1024 * 1024)
                    let memoryUsageGB = memoryUsageBytes / (1024 * 1024 * 1024)

                    if (
                        totalMemoryGB >=
                        totalMemoryBytes / (1024 * 1024 * 1024)
                    )
                        totalMemoryGB = totalMemoryGB.toFixed(2) + ' GB'
                    else
                        totalMemoryGB =
                            (totalMemoryBytes / (1024 * 1024)).toFixed(2) +
                            ' MB'

                    if (
                        memoryUsageGB >=
                        memoryUsageBytes / (1024 * 1024 * 1024)
                    )
                        memoryUsageGB = memoryUsageGB.toFixed(2) + ' GB'
                    else
                        memoryUsageGB =
                            memoryUsageBytes / (1024 * 1024).toFixed(2) + ' MB'

                    const processors = os.cpus()

                    const cpuUsage1 = os.cpus()[0].times
                    const startUsage1 =
                        cpuUsage1.user +
                        cpuUsage1.nice +
                        cpuUsage1.sys +
                        cpuUsage1.irq
                    let cpuUsage2
                    setTimeout(async () => {
                        cpuUsage2 = os.cpus()[0].times
                        const endUsage1 =
                            cpuUsage2?.user +
                            cpuUsage2?.nice +
                            cpuUsage2?.sys +
                            cpuUsage2?.irq

                        const totalUsage = endUsage1 - startUsage1

                        let idleUsage = 0
                        let totalIdle = 0

                        for (let i = 0; i < cpuCount; i++) {
                            const cpuUsage = os.cpus()[i].times
                            totalIdle += cpuUsage.idle
                        }

                        idleUsage =
                            totalIdle - (cpuUsage2.idle - cpuUsage1.idle)
                        const cpuUsagePercentage =
                            (totalUsage / (totalUsage + idleUsage)) * 100
                             const startTime = process.cpuUsage();
const endTime = process.cpuUsage();
const usedTime = endTime.user - startTime.user + endTime.system - startTime.system;
                        const ping = await client?.db?.ping()
                        const embed1 = new MessageEmbed()
                            .setColor(client.color)
                            .setAuthor({
                                name: 'BITZXIER Informations',
                                iconURL: client.guilds.cache
                                    .get('873228243757596672')
                                    ?.members?.cache?.get('1180425876798701588')
                                    ?.user?.displayAvatarURL({ dynamic: true })
                            })
                            .setDescription(
                                `**__System Informations__**\nSystem Latency: ${
                                    client.ws.ping
                                }ms\nPlatform: ${
                                    process.platform
                                }\nArchitecture: ${
                                    process.arch
                                }\nMemory Usage: ${memoryUsageGB}/${totalMemoryGB}\nProcessor 1:\n> Model: ${
                                    processors[0].model
                                }\n> Speed: ${
                                    processors[0].speed
                                } MHz\nTimes:\n> User: ${
                                    cpuUsage2.user
                                } ms\n> Nice: ${cpuUsage2.nice} ms\n> Sys: ${
                                    cpuUsage2.sys
                                } ms\n> Idle: ${cpuUsage2.idle} ms\n> IRQ: ${
                                    cpuUsage2.irq
                                } ms\nDatabase Latency: ${
                                    ping?.toFixed(2) || '0'
                                }ms`
                            )
                            .setThumbnail(client.user.displayAvatarURL())
                            .setFooter({
                                text: `Requested By ${message.author.tag}`,
                                iconURL: message.author.displayAvatarURL({
                                    dynamic: true
                                })
                            })
                        button = button.setDisabled(false)
                        button1 = button1.setDisabled(false)
                        button2 = button2.setDisabled(true)
                        button3 = button3.setDisabled(false)
                        const row1 = new MessageActionRow().addComponents([
                            button,
                            button1,
                            button2,
                            button3
                        ])
                        if (msg)
                            return msg.edit(
                                { embeds: [embed1], components: [row1] },
                                message,
                                msg
                            )
                    }, 2000)
                }
            }
        })
        collector.on('end', () => {
            if (msg) {
                button = button.setDisabled(true)
                button1 = button1.setDisabled(true)
                button2 = button2.setDisabled(true)
                button3 = button3.setDisabled(true)
                const row1 = new MessageActionRow().addComponents([
                    button,
                    button1,
                    button2,
                    button3
                ])
                return msg.edit({ components: [row1] })
            }
        })
    }
}
