const { Message, Client, MessageEmbed } = require('discord.js')
const Discord = require('discord.js')
module.exports = {
    name: 'role',
    aliases: ['r'],
    category: 'mod',
    premium: true,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color)
        let own = message.author.id == message.guild.ownerId
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`Manage Roles\` permissions to use this command.`
                        )
                ]
            })
        }
        if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I don't have \`Manage Roles\` permissions to execute this command.`
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
        let member =
            message.guild.members.cache.get(args[0]) ||
            message.mentions.members.first()
        if (!member) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You didn't used the command correctly.\n\`${message.guild.prefix}role <user> <role>\``
                        )
                ]
            })
        }
        let role = await findMatchingRoles(
            message.guild,
            args.slice(1).join(' ')
        )
        role = role[0]
        if (!role) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You didn't provided a valid role.\n\`${message.guild.prefix}role <user> <role>\``
                        )
                ]
            })
        }
        if(role.managed){
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | This Role Is Managed By Integration`
                        )
                ]
            })
        }
        if (role.position >= message.guild.me.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I can't provide this role as my highest role is either below or equal to the provided role.`
                        )
                ]
            })
        }
        if (!own && message.member.roles.highest.position <= role.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I can't provide this role as your highest role is either below or equal to the provided role.`
                        )
                ]
            })
        }
        let hasRole = member.roles.cache.has(role.id)
        if (hasRole) {
            member.roles.remove(
                role.id,
                `${message.author.tag}(${message.author.id})`
            )
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | Successfully removed <@&${role.id}> from <@${member.id}>.`
                        )
                ]
            })
        } else {
            member.roles.add(
                role.id,
                `${message.author.tag}(${message.author.id})`
            )
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | Successfully added <@&${role.id}> from <@${member.id}>.`
                        )
                ]
            })
        }  

    }
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
