const {
    MessageEmbed,
    version,
    MessageActionRow,
    MessageButton
} = require('discord.js')
const prefix = '&'
this.config = require(`${process.cwd()}/config.json`)
module.exports = {
    name: 'premium',
    description: "Show the user's profile",
    run: async (client, message, args) => {
        if (!this.config.owner.includes(message.author.id)) return
        const embed = new MessageEmbed()
            .setColor('#0x2b2d31')
            .setFooter(`Developed By Satxler Team`)
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('Premium')
                .setStyle('LINK')
                .setURL('https://discord.gg/zB6qdkETXr ')
        )
        let link = 'https://discord.gg/zB6qdkETXr '
        if (!args[0]) {
            embed.setAuthor(
                `${client.user.username} Premium`,
                client.user.displayAvatarURL(),
                'https://discord.gg/zB6qdkETXr '
            )
            embed.setThumbnail(message.guild.iconURL({ dynamic: true }))
            embed.setDescription(
                `If you are a subscriber, you can **upgrade** this server by typing \`${prefix}premium activate\`\nIf you have activated [Premium](${link}) here then you can **dowwngrade** [Premium](${link}) from this server by typing \`${prefix}premium revoke\`\nTo check the [Premium](${link}) status of this server just type \`${prefix}premium validity\`\nTo check your [Premium](${link}) status just type \`${prefix}premium stats\`.\n[Click here](${link}) to Purchase **[Premium](${link})**`
            )
            return message.reply({ embeds: [embed], components: [row] })
        }
        const isprem = await client.db.get(`uprem_${message.author.id}`)
        let type = args[0].toLowerCase()

        let own = await client.db.get(`spremown_${message.guild.id}`)

        let servers = (await client.db.get(`upremserver_${message.author.id}`))
            ? await client.db.get(`upremserver_${message.author.id}`)
            : []

        let isp = await client.db.get(`sprem_${message.guild.id}`)

        let time = await client.db.get(`upremend_${message.author.id}`)

        let count = (await client.db.get(`upremcount_${message.author.id}`))
            ? await client.db.get(`upremcount_${message.author.id}`)
            : 0

        switch (type) {
            case `activate`:
                if (!isprem)
                    return message.reply({
                        embeds: [
                            embed.setDescription(
                                `You don't have any type of premium subscription. Click [here](${link}) to [Purchase](${link}).`
                            )
                        ],
                        components: [row]
                    })
                if (count < 1)
                    return message.reply({
                        embeds: [
                            embed.setDescription(
                                `You have \`0\` Premium Count remaining. Click [here](${link}) to [Purchase](${link}).`
                            )
                        ],
                        components: [row]
                    })
                if (isp === `true`)
                    return message.reply({
                        embeds: [
                            embed.setDescription(
                                `This server's [Premium](${link}) has already been activated by <@${own}>.`
                            )
                        ]
                    })
                if (count > 0) {
                    await client.db.set(`sprem_${message.guild.id}`, `true`)
                    await client.db.set(`spremend_${message.guild.id}`, time)
                    await client.db.set(
                        `spremown_${message.guild.id}`,
                        `${message.author.id}`
                    )
                    await client.db.set(
                        `upremcount_${message.author.id}`,
                        count - 1
                    )
                    servers.push(`${message.guild.id}`)
                    client.db.set(`upremserver_${message.author.id}`, servers)
                    return message.reply({
                        embeds: [
                            embed.setDescription(
                                `This server has been added as a [Premium](${link}) Server.\n[Premium](${link}) valid till: <t:${Math.round(
                                    (await client.db.get(
                                        `spremend_${message.guild.id}`
                                    )) / 1000
                                )}> (<t:${Math.round(
                                    (await client.db.get(
                                        `spremend_${message.guild.id}`
                                    )) / 1000
                                )}:R>)`
                            )
                        ]
                    })
                }
                break

            case `revoke`:
                if (!isprem)
                    return message.reply({
                        embeds: [
                            embed.setDescription(
                                `You have \`0\` Premium Count remaining. Click [here](${link}) to [Purchase](${link}).`
                            )
                        ],
                        components: [row]
                    })

                if (!isp)
                    return message.reply({
                        embeds: [
                            embed.setDescription(
                                `This server haven't any type of premium subscription! If you are a subscriber, you can **upgrade** this server by typing \`${prefix}premium activate\`\nClick [here](${link}) to [Purchase](${link}).`
                            )
                        ],
                        components: [row]
                    })

                if (own !== message.author.id)
                    return message.reply({
                        embeds: [
                            embed.setDescription(
                                `You haven't activated the [Premium](${link}) on this Server to revoke it.`
                            )
                        ]
                    })
                await client.db.delete(`sprem_${message.guild.id}`)
                await client.db.delete(`spremend_${message.guild.id}`)
                await client.db.delete(`spremown_${message.guild.id}`)
                await client.db.set(
                    `upremcount_${message.author.id}`,
                    count + 1
                )
                servers = servers.filter((srv) => srv != `${message.guild.id}`)
                await client.db.set(`upremserver_${message.author.id}`, servers)
                return message.reply({
                    embeds: [
                        embed.setDescription(
                            `You have successfully **revoked** the [Premium](${link}) from this server.`
                        )
                    ]
                })
                break

            case `validity`:
                if (!isp)
                    return message.reply({
                        embeds: [
                            embed.setDescription(
                                `This server haven't any type of premium subscription! If you are a subscriber, you can **upgrade** this server by typing \`${prefix}premium activate\`\nClick [here](${link}) to [Purchase](${link}).`
                            )
                        ],
                        components: [row]
                    })
                return message.reply({
                    embeds: [
                        embed.setDescription(
                            `**Premium: \`Active\`\nPremium Activator: <@${own}>\nPremium Ends: <t:${Math.round(
                                (await client.db.get(
                                    `spremend_${message.guild.id}`
                                )) / 1000
                            )}> (<t:${Math.round(
                                (await client.db.get(
                                    `spremend_${message.guild.id}`
                                )) / 1000
                            )}:R>)**`
                        )
                    ]
                })
                break

            case `stats`:
                if (!isprem)
                    return message.reply({
                        embeds: [
                            embed.setDescription(
                                `You have \`0\` Premium Count remaining. Click [here](${link}) to [Purchase](${link}).`
                            )
                        ],
                        components: [row]
                    })
                let info = ''
                let ss
                if (servers.length < 1) info = `No Servers`
                else {
                    for (let i = 0; i < servers.length; i++) {
                        ss = await client.guilds.fetch(`${servers[i]}`)
                        info = info + `${i + 1} - ${ss.name} (${servers[i]})\n`
                    }
                }
                return message.reply({
                    embeds: [
                        embed
                            .setDescription(
                                `**Premium Count: \`${count}\`\nPremium Ends: <t:${Math.round(
                                    time / 1000
                                )}> (<t:${Math.round(time / 1000)}:R>)**`
                            )
                            .addField(
                                `**Servers where you activated Premium**`,
                                `\`\`\`nim\n${info}\`\`\``
                            )
                    ]
                })

            default:
                embed.setAuthor(
                    `${client.user.username} Premium`,
                    client.user.displayAvatarURL(),
                    'https://discord.gg/zB6qdkETXr '
                )
                embed.setThumbnail(message.guild.iconURL({ dynamic: true }))
                embed.setDescription(
                    `If you are a subscriber, you can **upgrade** this server by typing \`${prefix}premium activate\`\nIf you have activated [Premium](${link}) here then you can **dowwngrade** [Premium](${link}) from this server by typing \`${prefix}premium revoke\`\nTo check the [Premium](${link}) status of this server just type \`${prefix}premium validity\`\nTo check your [Premium](${link}) status just type \`${prefix}premium stats\`.\n[Click here](${link}) to Get **[Premium](${link})**`
                )
                return message.reply({ embeds: [embed], components: [row] })
        }
    }
}
