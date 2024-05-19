const {
    MessageEmbed,
    Collection,
    WebhookClient,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    MessageAttachment
} = require('discord.js')
const { getSettingsar } = require('../models/autorole')

this.config = require(`${process.cwd()}/config.json`)
let globalCooldown = false

module.exports = class Util {
    constructor(client) {
        this.client = client
    }

    async sendPreview(settings, member) {
        if (!settings.welcome?.enabled)
            return 'Welcome message not enabled in this server'

        const targetChannel = member.guild.channels.cache.get(
            settings.welcome.channel
        )
        if (!targetChannel)
            return 'No channel is configured to send welcome message'

        const response = await this.client.util.buildGreeting(
            member,
            'WELCOME',
            settings.welcome
        )

        let time = settings.welcome.autodel
        await this.client.util.sendMessage(targetChannel, response, time)

        return `Sent welcome preview to ${targetChannel.toString()}`
    }

    async setStatus(settings, status) {
        const enabled = status.toUpperCase() === 'ON' ? true : false
        settings.welcome.enabled = enabled
        await settings.save()
        return `Configuration saved! Welcome message ${enabled ? '**enabled**' : '**disabled**'}`
    }

    async setChannel(settings, channel) {
        if (!this.client.util.canSendEmbeds(channel)) {
            return (
                'Ugh! I cannot send greeting to that channel? I need the `Write Messages` and `Embed Links` permissions in ' +
                channel.toString()
            )
        }
        settings.welcome.channel = channel.id
        await settings.save()
        return `Configuration saved! Welcome message will be sent to ${channel ? channel.toString() : 'Not found'}`
    }

    async setDescription(settings, desc) {
        settings.welcome.embed.description = desc
        await settings.save()
        return 'Configuration saved! Welcome message updated'
    }

    async setTitle(settings, title) {
        settings.welcome.embed.title = title
        await settings.save()
        return 'Configuration saved! Welcome message updated'
    }

    async setThumbnail(settings, status) {
        settings.welcome.embed.thumbnail =
            status.toUpperCase() === 'ON' ? true : false
        await settings.save()
        return 'Configuration saved! Welcome message updated'
    }

    canSendEmbeds(channel) {
        return channel
            .permissionsFor(channel.guild.me)
            .has(['SEND_MESSAGES', 'EMBED_LINKS'])
    }

    async buildGreeting(member, type, config) {
        if (!config) return
        let content = config.content
            ? await this.client.util.parse(config.content, member)
            : `<@${member.user.id}>`
        const embed = new MessageEmbed()
        if (config.embed.description) {
            embed.setDescription(
                await this.client.util.parse(config.embed.description, member)
            )
        }
        embed.setColor(
            config.embed.color ? config.embed.color : member.client.color
        )
        if (config.embed.thumbnail) {
            embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        }
        if (config.embed.title) {
            embed.setTitle(
                await this.client.util.parse(config.embed.title, member)
            )
        }
        if (config.embed.footer) {
            embed.setFooter({
                text: await this.client.util.parse(config.embed.footer, member)
            })
        }

        if (
            !config.content &&
            !config.embed.description &&
            !config.embed.footer
        ) {
            return {
                content: `<@${member.user.id}>`,
                embeds: [
                    new MessageEmbed()
                        .setColor(this.client.color)
                        .setDescription(
                            `Hey ${member.displayName}, Welcome to the server <a:welcome:1188456678392348702>.`
                        )
                ]
            }
        }
        return { content, embeds: [embed] }
    }

    async sendMessage(channel, content, seconds) {
        if (!channel || !content) return
        const perms = ['VIEW_CHANNEL', 'SEND_MESSAGES']
        if (content.embeds && content.embeds.length > 0)
            perms.push('EMBED_LINKS')
        if (
            channel.type !== 'DM' &&
            !channel.permissionsFor(channel.guild.me).has(perms)
        )
            return
        try {
            if (!seconds || seconds == 0) return await channel.send(content)
            const reply = await channel.send(content)
            setTimeout(
                () => reply.deletable && reply.delete().catch((ex) => {}),
                seconds * 1000
            )
        } catch (ex) {
            return
        }
    }

    async sendWelcome(member, settings) {
        const config = (await getSettingsar(member.guild))?.welcome
        if (!config || !config.enabled) return

        const channel = member.guild.channels.cache.get(config.channel)
        if (!channel) return

        const response = await this.client.util.buildGreeting(
            member,
            'WELCOME',
            config
        )

        this.client.util.sendMessage(
            channel,
            response,
            settings.welcome.autodel
        )
    }

    isHex(text) {
        return /^#[0-9A-F]{6}$/i.test(text)
    }

    async parse(content, member) {
        let mention = `<@${member.user.id}>`
        return content
            .replaceAll(/\\n/g, '\n')
            .replaceAll(/{server}/g, member.guild.name)
            .replaceAll(/{count}/g, member.guild.memberCount)
            .replaceAll(/{member:name}/g, member.displayName)
            .replaceAll(/{member:mention}/g, mention)
            .replaceAll(/{member:id}/g, member.user.id)
            .replaceAll(
                /{member:created_at}/g,
                `<t:${Math.round(member.user.createdTimestamp / 1000)}:R>`
            )
    }


    async purgeMessages(issuer, channel, type, amount, argument) {
        if (
            !channel
                .permissionsFor(issuer)
                .has(['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'])
        ) {
            return 'MEMBER_PERM'
        }

        if (
            !channel
                .permissionsFor(issuer.guild.me)
                .has(['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'])
        ) {
            return 'BOT_PERM'
        }

        const toDelete = new Collection()

        try {
            const messages = await channel.messages.fetch(
                { limit: amount },
                { cache: false, force: true }
            )

            for (const message of messages.values()) {
                if (toDelete.size >= amount) break
                if (!message.deletable) continue

                if (type === 'ALL') {
                    toDelete.set(message.id, message)
                } else if (type === 'ATTACHMENT') {
                    if (message.attachments.size > 0) {
                        toDelete.set(message.id, message)
                    }
                } else if (type === 'BOT') {
                    if (message.author.bot) {
                        toDelete.set(message.id, message)
                    }
                } else if (type === 'LINK') {
                    if (containsLink(message.content)) {
                        toDelete.set(message.id, message)
                    }
                } else if (type === 'TOKEN') {
                    if (message.content.includes(argument)) {
                        toDelete.set(message.id, message)
                    }
                } else if (type === 'USER') {
                    if (message.author.id === argument) {
                        toDelete.set(message.id, message)
                    }
                }
            }

            if (toDelete.size === 0) return 'NO_MESSAGES'

            const deletedMessages = await channel.bulkDelete(toDelete, true)
            return deletedMessages.size
        } catch (ex) {
            return 'ERROR'
        }
    }

    async sendMessage(channel, content, seconds) {
        if (!channel || !content) return
        const perms = ['VIEW_CHANNEL', 'SEND_MESSAGES']
        if (content.embeds && content.embeds.length > 0)
            perms.push('EMBED_LINKS')
        if (
            channel.type !== 'DM' &&
            !channel.permissionsFor(channel.guild.me).has(perms)
        )
            return
        try {
            if (!seconds || seconds == 0) return await channel.send(content)
            const reply = await channel.send(content)
            setTimeout(
                () => reply.deletable && reply.delete().catch((ex) => {}),
                seconds * 1000
            )
        } catch (ex) {
            return
        }
    }
    /**
     * @param
     */
    async isExtraOwner(member, guild) {
        const data = await this.client.db.get(`extraowner_${guild.id}`)
        if (!data) return false
        if (data?.owner?.includes(member.id)) return true
        else return false
    }

    isHex(text) {
        return /^#[0-9A-F]{6}$/i.test(text)
    }

    hasHigher(member) {
        if (
            member.roles.highest.position <=
                member.guild.me.roles.highest.position &&
            member.user.id != member.guild.ownerId
        )
            return false
        else return true
    }

    async selectMenuHandle(interaction) {
        try {
            let options = interaction.values
            const funny = options[0]
            let _commands
            const embed = new MessageEmbed()
                .setAuthor({
                    name: this.client.user.username,
                    iconURL: this.client.user.displayAvatarURL()
                })
                .setColor(this.client.color)

                .setThumbnail(
                    interaction.guild.iconURL({
                        dynamic: true
                    })
                )

            if (funny === 'first') {
                _commands = this.client.commands
                    .filter((x) => x.category && x.category === 'security')
                    .map((x) => `\`${x.name}\``)
                embed.addField(
                    `**<:Satxler_antinuke:1181289584483643433> Antinuke \`[${_commands.length}]\`**`,
                    _commands.sort().join(', ')
                )
                interaction
                    .update({
                        embeds: [embed],
                        ephemeral: true
                    })
                    .catch((_) => {})
                return
            }
            if (funny === 'second') {
                _commands = this.client.commands
                    .filter((x) => x.category && x.category === 'mod')
                    .map((x) => `\`${x.name}\``)
                embed.addField(
                    `**<:Satxler_moderator:1181290384576491561> Moderation \`[${_commands.length}]\`**`,
                    _commands.sort().join(', ')
                )
                interaction
                    .update({
                        embeds: [embed],
                        ephemeral: true
                    })
                    .catch((_) => {})
                return
            }
            if (funny === 'third') {
                _commands = this.client.commands
                    .filter((x) => x.category && x.category === 'info')
                    .map((x) => `\`${x.name}\``)
                embed.addField(
                    `**<:Satxler_utility:1181291761667149886> Utility \`[${_commands.length}]\`**`,
                    _commands.sort().join(', ')
                )
                interaction
                    .update({
                        embeds: [embed],
                        ephemeral: true
                    })
                    .catch((_) => {})
                return
            }
            if (funny === 'fourth') {
                _commands = this.client.commands
                    .filter((x) => x.category && x.category === 'welcomer')
                    .map((x) => `\`${x.name}\``)
                embed.addField(
                    `**<:Satxler_autorole:1181290290238210158> Welcomer \`[${_commands.length}]\`**`,
                    _commands.sort().join(', ')
                )
                interaction
                    .update({
                        embeds: [embed],
                        ephemeral: true
                    })
                    .catch((_) => {})
                return
            }
            if (funny === 'fifth') {
                _commands = this.client.commands
                    .filter((x) => x.category && x.category === 'voice')
                    .map((x) => `\`${x.name}\``)
                embed.addField(
                    `**<:Satxler_mic:1181294198046072994> Voice \`[${_commands.length}]\`**`,
                    _commands.sort().join(', ')
                )
                interaction
                    .update({
                        embeds: [embed],
                        ephemeral: true
                    })
                    .catch((_) => {})
                return
            }
            if (funny === 'six') {
                let cmd = []
                this.client.commands
                    .filter((x) => x.category && x.category === 'customrole')
                    .forEach((x) => {
                        cmd.push(`\`${x.name}\``)
                        if (x.subcommand.length) {
                            x.subcommand.forEach((y) => {
                                cmd.push(`\`${x.name} ${y}\``)
                            })
                        }
                    })
                embed.addField(
                    `**<:Customrole:1199024011045253140> Customrole \`[${cmd.length}]\`**`,
                    cmd.sort().join(', ')
                )
                await interaction
                    .update({
                        embeds: [embed]
                    })
                    .catch((_) => _)
                return
            }
            if (funny === 'seven') {
                _commands = this.client.commands
                    .filter((x) => x.category && x.category === 'logging')
                    .map((x) => `\`${x.name}\``)
                embed.addField(
                    `**<:logs:1200416495461732353> Logging \`[${_commands.length}]\`**`,
                    _commands.sort().join(', ')
                )
                interaction
                    .update({
                        embeds: [embed],
                        ephemeral: true
                    })
                    .catch((_) => {})
                return
            }
            if (funny === 'eight') {
                let cmd = []
                this.client.commands
                    .filter((x) => x.category && x.category === 'automod')
                    .forEach((x) => {
                        cmd.push(`\`${x.name}\``)
                        if (x.subcommand.length) {
                            x.subcommand.forEach((y) => {
                                cmd.push(`\`${x.name} ${y}\``)
                            })
                        }
                    })
                embed.addField(
                    `**<:Satxler_Automod:1205791245473943553> Automod \`[${cmd.length}]\`**`,
                    cmd.sort().join(', ')
                )
                await interaction
                    .update({
                        embeds: [embed]
                    })
                    .catch((_) => _)
                return
            }
        } catch (err) {
            return
        }
    }


    async manageAfk(message, client) {
        const db = require('../models/afk.js')
        let data = await db.findOne({
            Guild: message.guildId,
            Member: message.author.id
        })
        if (data) {
            if (message.author.id === data.Member) {
                await data.deleteOne()
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(message.client.color)
                            .setDescription(`I Removed Your AFK `)
                    ]
                })
            }
        }
        const memberMentioned = message.mentions.users.first()

        if (memberMentioned) {
            data = await db.findOne({
                Guild: message.guildId,
                Member: memberMentioned.id
            })
            if (data) {
                message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(message.client.color)
                            .setDescription(
                                `<@${memberMentioned.id}> went AFK <t:${Math.round(data.Time / 1000)}:R>\n\nFor Reason: **${data.Reason}**`
                            )
                    ]
                })
            } else {
                return;
            }
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes'
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
    }

    ownerbutton() {
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('DELETE')
                .setCustomId('DELETE_BUT')
                .setStyle('DANGER')
        )
        return row
    }
    async setPrefix(message, client) {
        let prefix = await this.client.db.get(`prefix_${message?.guild?.id}`)
        if (prefix === null) prefix = '&'
        message.guild.prefix = prefix
    }

    async noprefix() {
        let data = (await this.client.db.get(`noprefix_${this.client.user.id}`))
            ? await this.client.db.get(`noprefix_${this.client.user.id}`)
            : []
        this.client.noprefix = data
    }
    async blacklist() {
        let data = (await this.client.db.get(
            `blacklist_${this.client.user.id}`
        ))
            ? await this.client.db.get(`blacklist_${this.client.user.id}`)
            : []
        this.client.blacklist = data
    }
    async blacklistserver() {
        let data2 = (await this.client.data.get(
            `blacklistserver_${this.client.user.id}`
        ))
            ? await this.client.data.get(`blacklistserver_${this.client.user.id}`)
            : []
        this.client.blacklistserver = data2
    }
    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async handleRateLimit() {
        globalCooldown = true
        await this.client.util.sleep(5000)
        globalCooldown = false
    }

    async FuckYou(
        member,
        reason = 'Unwhitelisted User | Performed Suspicious Activity'
    ) {
        try {
            await member.guild.members
                .ban(member.id, {
                    reason: reason
                })
                .catch((_) => {})
        } catch (err) {
            return
        }
    }

    async BlacklistCheck(guild) {
        try {
            let data = await this.client.data.get(`blacklistserver_${this.client.user.id}`) || [];
            if (data.includes(guild.id)) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking blacklist:', error);
            return false;
        }
    }
    

    async sendBooster(guild, member) {
        const db = require(`${process.cwd()}/models/boost.js`)
        const data = await db.findOne({ Guild: guild.id })
        if (!data || !data.Boost) return
        try {
            let channel = guild.channels.cache.get(data.Boost)
            if (!channel) return
            let count = guild.premiumSubscriptionCount
            const embed = new MessageEmbed()
                .setColor(guild.roles.premiumSubscriberRole.color)
                .setAuthor({
                    name: `🎉🎉 NEW BOOSTER 🎉🎉`,
                    iconURL: `https://cdn.discordapp.com/emojis/1035418876470640660.gif`
                })
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    `**<@${member.id}> Just Boosted ${guild.name}. Thank You So Much For Boosting Our Server. We Now Have Total ${count} Boosts On Our Server!!**`
                )
                .setFooter({
                    text: `Server Boosted 🎉 `,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setTimestamp()
            await channel.send({ embeds: [embed] })
        } catch (err) {
            return
        }
    }

    async pagination(message, description, desc = '') {
        const lodash = require('lodash')
        let previousbut = new MessageButton()
            .setCustomId('queueprev')
            .setEmoji('<:ARROW1:1182736084766036059>')
            .setStyle('SUCCESS')
        let nextbut = new MessageButton()
            .setCustomId('queuenext')
            .setEmoji('<:ARROW:1182735884978765957>')
            .setStyle('SUCCESS')
        let row = new MessageActionRow().addComponents(previousbut, nextbut)
        const pages = lodash.chunk(description, 10).map((x) => x.join(`\n`))
        let page = 0
        let msg
        if (pages.length <= 1) {
            return await message.channel.send({
                content: desc + this.client.util.codeText(pages[page])
            })
        } else {
            msg = await message.channel.send({
                content: desc + this.client.util.codeText(pages[page]),
                components: [row]
            })
        }
        const collector = message.channel.createMessageComponentCollector({
            filter: (b) => {
                if (b.user.id === message.author.id) return true
                else {
                    b.reply({
                        ephemeral: true,
                        content: `Only **${message.author.tag}** can use this button, run the command again to use the queue menu.`
                    })
                    return false
                }
            },
            time: 60000 * 5,
            idle: 30e3
        })
        collector.on('collect', async (b) => {
            if (!b.deferred) await b.deferUpdate().catch(() => {})
            if (b.message.id !== msg.id) return
            if (b.customId === 'queueprev') {
                page = page - 1 < 30 ? pages.length - 1 : --page
                return await msg
                    .edit({
                        content: desc + this.client.util.codeText(pages[page])
                    })
                    .catch((e) => {
                        return
                    })
            } else if (b.customId === 'queuenext')
                page = page + 1 >= pages.length ? 0 : ++page
            if (!msg) return
            return await msg
                .edit({
                    content: desc + this.client.util.codeText(pages[page])
                })
                .catch((e) => {
                    return
                })
        })
        collector.on('end', async () => {
            await msg.edit({ components: [] }).catch((e) => {
                return
            })
        })
    }

    codeText(text, type = 'js') {
        return `\`\`\`${type}\n${text}\`\`\``
    }

    async haste(text) {
        const req = await this.client.snek.post(
            'https://haste.ntmnathan.com/documents',
            { text }
        )
        return `https://haste.ntmnathan.com/${req.data.key}`
    }

    removeDuplicates(arr) {
        return [...new Set(arr)]
    }

    removeDuplicates2(arr) {
        return [...new Set(arr)]
    }
}
