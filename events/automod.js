const { MessageEmbed } = require('discord.js')
module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        let check =  await client.util.BlacklistCheck(message?.guild)
        if(check) return  
                    try {
            if (message.author.bot) return
            if (message.webhookId) return
            let antilink = await client.db.get(`antilink_${message.guild.id}`)
            if (antilink !== true) {
                return
            }
            const bypass1 = (await client.db.get(
                `automodbp_${message.guild.id}`
            )) ?? { user: [], role: [], channel: [] }

            if (message.author.id === client.user.id) return
            if (message.author.id === message.guild.ownerId) return
            if (!message.guild || !message.member) return;
            if (message.member.permissions.has('ADMINISTRATOR')) return;
            if(bypass1.channel.includes(message.channel.id)) return;
            if (bypass1.user.includes(message.author.id)) return
            if (
                message.member.roles.cache.some((role) =>
                    bypass1.role.includes(role.id)
                )
            )
                return

            let punishment = (await client.db.get(
                `antilinkp_${message.guild.id}`
            )) ?? { data: null }
            const action = punishment.data
            const urlRegex = /\b(?:https?:\/\/|www\.)\S+/gi
            const regex =
                /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi
            const checkmessage = message.content
            if (regex.test(checkmessage) || urlRegex.test(checkmessage)) {
                try {
                    if (!action || action === 'mute') {
                        await message.delete()
                        if (message.member.manageable) {
                            try {
                                await message.member.timeout(
                                    30 * 60 * 1000,
                                    'Satxler | ANTILINK | TIMEOUT'
                                )
                                let scucess = await message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${message.author.tag}  has been muted for sending links.`
                                            )
                                    ]
                                })
                                await client.util.sleep(3000)
                                await scucess.delete()
                            } catch (err) {
                                if (err.code === 429) {
                                    await client.util.handleRateLimit()
                                }
                                return
                            }
                        }
                    }
                    if (action === 'kick') {
                        await message.delete()
                        if (message.member.kickable) {
                            try {
                                await message.guild.members.kick(
                                    message.member.id,
                                    'Satxler | ANTILINK | KICK'
                                )
                                let scucess = await message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${message.author.tag} has been kicked for sending links.`
                                            )
                                    ]
                                })
                                await client.util.sleep(3000)
                                await scucess.delete()
                            } catch (err) {
                                if (err.code === 429) {
                                    await client.util.handleRateLimit()
                                }
                                return
                            }
                        }
                    }
                    if (action === 'ban') {
                        await message.delete()
                        if (message.member.bannable) {
                            try {
                                let reason = 'Satxler | ANTILINK | BAN'
                                await message.guild.members
                                    .ban(message.member.id, { reason: reason })
                                    .catch((e) => console.log(e))
                                let scucess = await message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `${message.author.tag} has been banned for sending links.`
                                            )
                                    ]
                                })
                                await client.util.sleep(3000)
                                await scucess.delete()
                            } catch (err) {
                                if (err.code === 429) {
                                    await client.util.handleRateLimit()
                                }
                                return
                            }
                        }
                    }
                } catch (err) {
                    if (err.code === 429) {
                        await client.util.handleRateLimit()
                    }
                    return
                }
            }
        } catch (err) {
            if (err.code === 429) {
                await client.util.handleRateLimit()
            }
            return
        }
    })

    const usersMap = new Map()
    const DIFF = 10000
    client.on('messageCreate', async (message) => {
        let check =  await client.util.BlacklistCheck(message?.guild)
        if(check) return  
            try {
            if (!message.guild) return
            if (message.author.bot) return
            if (message.webhookId) return
            let antispam = await client.db?.get(`antispam_${message.guild.id}`)
            if (antispam !== true) return
            const bypass = (await client.db.get(
                `automodbp_${message.guild.id}`
            )) ?? { user: [], role: [], channel: [] }
            if (message.author.id === client.user.id) return
            if (message.author.id === message.guild.ownerId) return
            if (!message.guild || !message.member) return;
            if (message.member.permissions.has('ADMINISTRATOR')) return;
            if(bypass.channel.includes(message.channel.id)) return;
            if (bypass.user.includes(message.author.id)) return
            if (
                message.member.roles.cache.some((role) =>
                    bypass.role.includes(role.id)
                )
            )
                return

            let punishment = (await client.db.get(
                `antispamp_${message.guild.id}`
            )) ?? { data: null }
            const action = punishment.data
            const data = (await client.db.get(
                `antispamlimit_${message.guild.id}`
            )) ?? null 
            let LIMIT = data ?? 4

            if (usersMap.has(message.author.id)) {
                const userData = usersMap.get(message.author.id)
                const { lastMessage, timer } = userData
                const difference =
                    message.createdTimestamp - lastMessage.createdTimestamp
                let msgCount = userData.msgCount

                if (difference > DIFF) {
                    clearTimeout(timer)
                    userData.msgCount = 1
                    userData.lastMessage = message
                    userData.timer = setTimeout(() => {
                        usersMap.delete(message.author.id)
                    }, 10000)
                    usersMap.set(message.author.id, userData)
                } else {
                    ++msgCount
                    if (msgCount >= LIMIT) {
                        if (!action || action === 'mute') {
                            await message.channel.bulkDelete(LIMIT)
                            if (message.member.manageable) {
                                try {
                                    await message.member.timeout(
                                        30 * 60 * 1000,
                                        'Satxler | ANTISPAM | TIMEOUT'
                                    )
                                    let success = await message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(client.color)
                                                .setDescription(
                                                    `${message.author.tag} has been muted for spamming.`
                                                )
                                        ]
                                    })
                                    await client.util.sleep(3000)
                                    await success.delete()
                                } catch (err) {
                                    if (err.code === 429) {
                                        await client.util.handleRateLimit()
                                    }
                                    return
                                }
                            }
                        } else if (action === 'kick') {
                            await message.channel.bulkDelete(LIMIT)

                            if (message.member.kickable) {
                                try {
                                    await message.member.kick(
                                        'Satxler | ANTISPAM | KICK'
                                    )
                                    let success = await message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(client.color)
                                                .setDescription(
                                                    `${message.author.tag} has been kicked for spamming.`
                                                )
                                        ]
                                    })
                                    await client.util.sleep(3000)
                                    await success.delete()
                                } catch (err) {
                                    if (err.code === 429) {
                                        await client.util.handleRateLimit()
                                    }
                                    return
                                }
                            }
                        } else if (action === 'ban') {
                            await message.channel.bulkDelete(LIMIT)
                            if (message.member.banable) {
                                try {
                                    await message.member.ban(
                                        'Satxler | ANTISPAM | BAN'
                                    )
                                    let success = await message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor(client.color)
                                                .setDescription(
                                                    `${message.author.tag} has been banned for spamming.`
                                                )
                                        ]
                                    })
                                    await client.util.sleep(3000)
                                    await success.delete()
                                } catch (err) {
                                    if (err.code === 429) {
                                        await client.util.handleRateLimit()
                                    }
                                    return
                                }
                            }
                        }
                    } else {
                        userData.msgCount = msgCount
                        usersMap.set(message.author.id, userData)
                    }
                }
            } else {
                let fn = setTimeout(() => {
                    usersMap.delete(message.author.id)
                }, 10000)
                usersMap.set(message.author.id, {
                    msgCount: 1,
                    lastMessage: message,
                    timer: fn
                })
            }
        } catch (err) {
            if (err.code === 429) {
                await client.util.handleRateLimit()
            }
            return
        }
    })


}