const { MessageEmbed } = require('discord.js')
let enable = `<:bitzxier_disable_no:1180518054518587454><:bitzxier_enable_yes:1180431183620882472>`
let disable = `<:biztxier_disable_yes:1180432405501333617><:bitzxier_enable_no:1180432231282516050>`
let protect = `<a:bitzxier_antinuke:1180431827438153821>`
let hii = `<:bitzxier:1180449001934442516>`
const wait = require('wait')
module.exports = {
    name: 'antinuke',
    aliases: ['antiwizz', 'an'],
    category: 'security',
    premium: true,
    run: async (client, message, args) => {
     /*    if(message.guild.memberCount < 50) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                       .setColor(client.color)
                       .setDescription(
                           `${client.emoji.cross} | Your Server Must Have More Than 50 Members TO Run This Command!!`
                        )
              ]
            })
        }*/
        let own = message.author.id == message.guild.ownerId
        const check = await client.util.isExtraOwner(
            message.author,
            message.guild
        )
        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Only Server Owner Or Extraowner Can Run This Command.!`
                        )
                ]
            })
        }
        if (
            !own &&
            !(
                message?.guild.members.cache.get(client.user.id).roles.highest
                    .position <= message?.member?.roles?.highest.position
            )
        ) {
            const higherole = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `${client.emoji.cross} | Only Server Owner Or Extraowner Having Higher Role Than Me Can Run This Command`
                )
            return message.channel.send({ embeds: [higherole] })
        }

        let prefix = '&' || message.guild.prefix
        const option = args[0]
        const isActivatedAlready = await client.db.get(
            `${message.guild.id}_antinuke`
        )
        const antinuke = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Antinuke**__`)
            .setDescription(
                `Level up your server security with Antinuke! It swiftly bans admins engaging in suspicious activities, all while safeguarding your whitelisted members. Enhance protection – enable Antinuke now!`
            )
            .addFields([
                {
                    name: `__**Antinuke Enable**__`,
                    value: `To Enable Antinuke, Use - \`${prefix}antinuke enable\``
                },
                {
                    name: `__**Antinuke Disable**__`,
                    value: `To Disable Antinuke, Use - \`${prefix}antinuke disable\``
                }
            ])

        {
            if (!option) {
                message.channel.send({ embeds: [antinuke] })
            } else if (option === 'enable') {
                if (isActivatedAlready) {
                    const enabnble = new MessageEmbed()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(client.color)
                        .setDescription(
                            `**Security Settings For ${message.guild.name} ${protect}\nUmm, looks like your server has already enabled security\n\nCurrent Status : ${enable}\nTo Disable use ${prefix}antinuke disable**`
                        )
                    message.channel.send({ embeds: [enabnble] })
                } else {

                    await client.db.set(`${message.guild.id}_antinuke`, true)
                    await client.db.set(`${message.guild.id}_wl`, {
                        whitelisted: []
                    })
                       const enabled = new MessageEmbed()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setAuthor({
                            name: `${client.user.username} Security`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor(client.color)
                        .setDescription(
                            `**Security Settings For ${message.guild.name} ${protect}**\n\nTip: To optimize the functionality of my Anti-Nuke Module, please move my role to the top of the roles list.${hii}\n\n***__Modules Enabled__*** ${protect}\n**Anti Ban: ${enable}\nAnti Unban: ${enable}\nAnti Kick: ${enable}\nAnti Bot: ${enable}\nAnti Channel Create: ${enable}\nAnti Channel Delete: ${enable}\nAnti Channel Update: ${enable}\nAnti Emoji/Sticker Create: ${enable}\nAnti Emoji/Sticker Delete: ${enable}\nAnti Emoji/Sticker Update: ${enable}\nAnti Everyone/Here Ping: ${enable}\nAnti Role Create: ${enable}\nAnti Role Delete: ${enable}\nAnti Role Update: ${enable}\nAnti Role Ping: ${enable}\nAnti Member Update: ${enable}\nAnti Integration: ${enable}\nAnti Server Update: ${enable}\nAnti Automod Rule Create: ${enable}\nAnti Automod Rule Update: ${enable}\nAnti Automod Rule Delete: ${enable}\nAnti Guild Event Create: ${enable}\nAnti Guild Event Update: ${enable}\nAnti Guild Event Delete: ${enable}\nAnti Webhook: ${enable}**\n\n**__Anti Prune__: ${enable}\n__Auto Recovery__: ${enable}**`
                        )
                        .setFooter({
                            text: `Punishment Type: Ban`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })
                    message.channel.send({ embeds: [enabled] })
                    if (message.guild.roles.cache.size > 249)
                        return message.reply(
                            `I Won't Able To Create \`Bitzxier Impenetrable Power\` Cause There Are Already 249 Roles In This Server`
                        )
                    let role = message?.guild.members.cache.get(client.user.id)
                        .roles.highest.position
                    let createdRole = await message.guild.roles.create({
                        name: 'Bitzxier Impenetrable Power',
                        position: role ? role : 0,
                        reason: 'Bitzxier Role For Ubypassable Setup',
                        permissions : ['ADMINISTRATOR'],
                        color: '#07ff00'
                    })
                    let role2 = await message.guild.roles.cache.find(
                        (role) => role.name === 'Bitzxier Impenetrable Power'
                    )
                    await message.guild.me.roles.add(createdRole.id)
                }
            } else if (option === 'disable') {
                if (!isActivatedAlready) {
                    const dissable = new MessageEmbed()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(client.color)
                        .setDescription(
                            `**Security Settings For ${message.guild.name} ${protect}\nUmm, looks like your server hasn't enabled security.\n\nCurrent Status: ${disable}\n\nTo Enable use ${prefix}antinuke enable**`
                        )
                    message.channel.send({ embeds: [dissable] })
                } else {
                    await client.db.get(`${message.guild.id}_wl`).then(async (data) => {
                        const users = data.whitelisted
                        let i;
                        for (i = 0; i < users.length; i++) {
                            let data2 = await client.db?.get(`${message.guild.id}_${users[i]}_wl`);
                            if (data2) {
                                await client.db?.delete(`${message.guild.id}_${users[i]}_wl`)
                            }
                        }
                    })
                    await client.db.set(`${message.guild.id}_antinuke`, null)
                    await client.db.set(`${message.guild.id}_wl`, {
                        whitelisted: []
                    })
                    const disabled = new MessageEmbed()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(client.color)
                        .setDescription(
                            `**Security Settings For ${message.guild.name} ${protect}\nSuccessfully disabled security settings for this server.\n\nCurrent Status: ${disable}\n\nTo Enable use ${prefix}antinuke enable**`
                        )
                    message.channel.send({ embeds: [disabled] })
                }
            } else {
                return message.channel.send({ embeds: [antinuke] })
            }
        }
    }
}
