const { getSettingsar } = require('../models/autorole')
/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {
        if (!member || !member.guild) return
        const { guild } = member
        const settings = await getSettingsar(guild)
        if (settings.autorole.length > 0) {
            for (let i = 0; i < settings.autorole.length; i++) {
                const role = guild.roles.cache.get(settings.autorole[i])
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
                )
               await member.roles.add(role,"Bitzxier Autorole").catch((err) => {});
            }
          }
          if(!settings.welcome.enabled) return;
          client.util.sendWelcome(member, settings);
        })
      }

