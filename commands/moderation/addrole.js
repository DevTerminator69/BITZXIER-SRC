const { Message, Client, MessageEmbed, Permissions } = require('discord.js')
const Discord = require('discord.js')
const ms = require('ms')
const moment = require('moment')
require('moment-duration-format')
let roleAssignmentInterval
let startTime

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

        let role = await findMatchingRoles(
            message.guild,
            args.slice(1).join(' ')
        )
        /*  if(args[0] === 'all') {
            role = role[0]
            if(!role) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | You didn't provided a valid role.\n\`${message.guild.prefix}role all <role>\``
                            )
                    ]
                })
            }

            let array = ["KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "MENTION_EVERYONE", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EVENTS", "MODERATE_MEMBERS", "MANAGE_EMOJIS_AND_STICKERS"];

            if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_EVENTS") || role.permissions.has("MODERATE_MEMBERS") || role.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) return message.channel.send({ embeds: [new MessageEmbed().setDescription(`${client.emoji.cross} | This <@&${role.id}> Role is having Dangerous Permissions So i won't give it to everyone \n ROLE PERMISSIONS : ${new Permissions(role.permissions.bitfield).toArray().filter(a => array.includes(a)).map(arr => `\`${arr}\``).join(", ")} permissions`).setColor(client.color)] })
      if(role && role.editable) {

        const user = await message.guild.members.fetch().then(m => m.filter(x => !x.roles.cache.has(role))).then(m => m.map(me => me));
        const delay = 1500; // Delay in milliseconds
        const membersWithoutRole = await message.guild.members.fetch().then(m => m.filter(x => !x.roles.cache.has(role.id)));

        if (membersWithoutRole.size === 0) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`All members already have the provided role: ${role.name}`)
                ]
            });
        }

        let i;
        let t = 1500 * user.length;
        startTime = Math.round(Date.now() + ms(`${t} seconds`) / 1000);

        const st = moment.duration(startTime).format("hh:mm:ss");
    
        const startMessage = await message.channel.send(`Role assignment started! Adding ${role.name} to eligible members...`);
        
        roleAssignmentInterval = setInterval(() => {
            if (i >= user.length) {
                clearInterval(roleAssignmentInterval);
                roleAssignmentInterval = null;
                const completionEmbed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle('Role Assignment Completed')
                    .setDescription(`Role assignment for ${role.name} has been successfully completed.`)
                    .addField('Total Members', user.length, true)
                    .setFooter('Thank you for using the role assignment feature.');
                startMessage.edit({ embeds: [completionEmbed] });
                startTime = null;
                return;
            }
    
            const member = user[i];
            member.roles.add(role.id)
                .then(() => {
                    const completedPercentage = Math.floor((i / user.length) * 100);
                    const remainingTimeInSeconds = Math.round((startTime - Date.now()) / 1000);
                    const elapsedTime = Math.round((startTime - remainingTimeInSeconds) / 1000);
                })
                .catch((err) => {
                    console.error(`Failed to add role to ${member.user.tag}: ${err}`);
                });
    
            i++;
        }, delay);
      } else {
        return message.channel.send({ embeds: [new MessageEmbed().setDescription(`${client.emoji.cross} | I can't provide this role as my highest role is either below or equal to the provided role.`
        )]})

      }
       
        } else if(args[0] === 'status') {
  if (roleAssignmentInterval) {
    const completedPercentage = Math.floor((i / members.length) * 100);
    const remainingTimeInSeconds = ((members.length - i) * delay) / 1000;
    message.channel.send(`Role assignment progress: ${completedPercentage}% | Remaining time: ${remainingTimeInSeconds} seconds`);
} else {
    message.channel.send({ content : `THERE IS NO PROCESS`})
}
        } else if(args[0] === 'cancel') {
            if (roleAssignmentInterval) {
                clearInterval(roleAssignmentInterval);
                roleAssignmentInterval = null;
        
                const cancelEmbed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`Role addition process has been successfully stopped.`);
        
                message.channel.send({ embeds: [cancelEmbed] });
            } else {
                const noProgressEmbed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`There is no ongoing role addition progress.`);
        
                message.channel.send({ embeds: [noProgressEmbed] });
            }
        } else {
        */
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
        if (role.managed) {
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
                            `${client.emoji.tick} | Successfully added <@&${role.id}> to <@${member.id}>.`
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
