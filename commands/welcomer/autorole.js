const { MessageEmbed } = require('discord.js')
const { getSettingsar } = require('../../models/autorole')

module.exports = {
    name: 'autorole',
    aliases: ['ar'],
    category: 'welcomer',
    premium: true,
    run: async (client, message, args) => {
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
        const settings = await getSettingsar(message.guild)
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
        let isown = message.author.id == message.guild.ownerId
        if (!isown && !client.util.hasHigher(message.member)) {
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
        const err = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addFields([
                { name: `\`autorole\``, value: `**Shows the current page.**` },
                {
                    name: `\`autorole add <role>\``,
                    value: `**Adds the provided role to Auto-Role Configuration.**`
                },
                {
                    name: `\`autorole remove <role>\``,
                    value: `**Removes the provided role from Auto-Role Configuration.**`
                },
                {
                    name: `\`autorole list\``,
                    value: `**Shows the Auto-Roles Configuration.**`
                },
                {
                    name: `\`autorole reset\``,
                    value: `**Resets the Auto-Role Configuration**\n‎ `
                }
            ])
            .setFooter({
                text: `Note: At the time of providing Auto-Role when someone joins the server, I'll ignore the roles which have Administration Perms.`,
                iconURL: client.user.displayAvatarURL()
            })
        const option = args[0]
        if (!option) {
            return message.channel.send({ embeds: [err] })
        }
        let response
        if (option.toLowerCase() === 'reset') {
            response = await addAutoRole(message, null)
        } else if (option.toLowerCase() === 'add') {
            let input = args.slice(1).join(' ')
            const roles = findMatchingRoles(message.guild, input)
            if (roles.length === 0)
                response = 'No matching roles found matching your query'
            else {
                response = await addAutoRole(message, roles[0])
            }
        } else if (option.toLowerCase() === 'remove') {
            let input = args.slice(1).join(' ')
            const roles = findMatchingRoles(message.guild, input)
            if (roles.length === 0)
                response = 'No matching roles found matching your query'
            else response = await removeAutoRole(message, roles[0])
        } else if (option.toLowerCase() == 'list') {
            response = await listAutoRole(message)
        } else return message.channel.send({ embeds: [err] })
        await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(response)
                    .setColor(client.color)
            ]
        })
    }
}

async function addAutoRole({ guild, client }, role) {
    const settings = await getSettingsar(guild)
    if (role) {
        if (!guild.me.permissions.has('MANAGE_ROLES'))
            return `${client.emoji.cross} | I don't have the \`MANAGE_ROLES\` permission`
        if (guild.me.roles.highest.position < role.position)
            return `${client.emoji.cross} | I don't have the permissions to assign this role`
        if (role.managed)
            return `${client.emoji.cross} | This role is managed by an integration.`
    }
    if (!role) {
        settings.autorole = []
        await settings.save()
        return `${client.emoji.tick} | Autorole module was successfully disabled.`
    }
    if (settings.autorole.includes(role.id))
        return `${client.emoji.cross} | This role is already present in the autorole config.`
    if (settings.autorole.length == 10)
        return `${client.emoji.cross} | Maximum 10 roles can be set for Auto Roles.`
    else settings.autorole.push(role.id)
    await settings.save()
    return `${client.emoji.tick} | Successfully **added** <@&${role.id}> to Autorole Config.`
}

async function removeAutoRole({ guild, client }, role) {
    const settings = await getSettingsar(guild)
    if (role) {
        if (!guild.me.permissions.has('MANAGE_ROLES'))
            return `${client.emoji.cross} | I don't have the \`MANAGE_ROLES\` permission`
    }
    if (!settings.autorole.includes(role.id))
        return `${client.emoji.cross} | This role is not present in the autorole config.`
    if (settings.autorole.length == 0)
        return `${client.emoji.cross} | There are no Autoroles in my config.`
    else settings.autorole = settings.autorole.filter((r) => r !== role.id)
    await settings.save()
    return `${client.emoji.tick} | Successfully **removed** <@&${role.id}> from Autorole Config.`
}

async function listAutoRole({ guild, client }) {
    const settings = await getSettingsar(guild)
    if (settings.autorole.length == 0)
        return 'There are no Autoroles available for this server.'
    let roles = settings.autorole
        .map((role) => `${client.emoji.dot} <@&${role}> (${role})`)
        .join('\n')
    roles =
        `**Auto-Role list for ${guild.name} - ${settings.autorole.length}\n\n` +
        roles +
        `**`
    return roles
}

function findMatchingRoles(guild, query) {
    const ROLE_MENTION = /<?@?&?(\d{17,20})>?/
    if (!guild || !query || typeof query !== 'string') return []

    const patternMatch = query.match(ROLE_MENTION)
    if (patternMatch) {
        const id = patternMatch[1]
        const role = guild.roles.cache.find((r) => r.id === id)
        if (role) return [role]
    }

    const exact = []
    const startsWith = []
    const includes = []
    guild.roles.cache.forEach((role) => {
        const lowerName = role.name.toLowerCase()
        if (role.name === query) exact.push(role)
        if (lowerName.startsWith(query.toLowerCase())) startsWith.push(role)
        if (lowerName.includes(query.toLowerCase())) includes.push(role)
    })
    if (exact.length > 0) return exact
    if (startsWith.length > 0) return startsWith
    if (includes.length > 0) return includes
    return []
}
