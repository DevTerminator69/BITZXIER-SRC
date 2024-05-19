const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "userinfo",
    aliases: ['ui', 'whois'],
    category: 'info',
    description: "Get information about a user",
    run: async (client, message, args) => {
        const permissions = {
            "ADMINISTRATOR": "Administrator",
            "MANAGE_GUILD": "Manage Server",
            "MANAGE_ROLES": "Manage Roles",
            "MANAGE_CHANNELS": "Manage Channels",
            "KICK_MEMBERS": "Kick Members",
            "BAN_MEMBERS": "Ban Members",
            "MANAGE_NICKNAMES": "Manage Nicknames",
            "MANAGE_EMOJIS": "Manage Emojis",
            "MANAGE_WEBHOOKS": "Manage Webhooks",
            "MANAGE_MESSAGES": "Manage Messages",
            "MENTION_EVERYONE": "Mention Everyone"
        };

        let mention = await getUserFromMention(message, args[0]);

        if (!mention) {
          try {
            mention = await client.users.fetch(args[0])
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Please Provide Valid user ID or Mention Member.`
                        )
                ]
            })
        }
        }

        const nick = mention.nickname || "None";
        const usericon = mention.displayAvatarURL({ dynamic: true });

        const mentionPermissions = mention.permissions.toArray();
        const finalPermissions = mentionPermissions.map(permission => permissions[permission]).filter(Boolean);

        const flags = {
            "DISCORD_EMPLOYEE": "<:discord_employee:1026903789262880800>",
            "DISCORD_PARTNER": "<:partners:1026903940685627443>",
            "BUGHUNTER_LEVEL_1": "<:bug_hunter:1026904095895859240>",
            "BUGHUNTER_LEVEL_2": "<:BugHunter2:1026904223234932806>",
            "HYPESQUAD_EVENTS": "<:hypesquad_events:1026904392022102086>",
            "HOUSE_BRILLIANCE": "<:brilliance:1026904485819326595>",
            "HOUSE_BRAVERY": "<:bravery:1026904604660748369>",
            "HOUSE_BALANCE": "<:balance:1026904705890254859>",
            "EARLY_SUPPORTER": "<:EarlySupporter:1026904834663788674>",
            "TEAM_USER": "<:TEAM_USER:1026905011298504855>",
            "VERIFIED_BOT": "<:VerifiedBot:1026905121042477106>",
            "EARLY_VERIFIED_DEVELOPER": "<:BotDeveloper:1026905242618576956>"
        };

        const userFlags = mention.flags.toArray();

        const topRole = mention.roles.highest;

        const isMemberInServer = message.guild.members.cache.has(mention.id);

        const userlol = new MessageEmbed()
            .setAuthor(`${mention.username}'s Information`, usericon)
            .setThumbnail(usericon)
            .addField(`General Information`,
                `Name: \`${mention.username}#${mention.discriminator}\`\n` +
                `Nickname: \`${nick}\`\n\n`
            )
            .addField(`Overview`,
                `Badges: ${userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : 'None'}\n` +
                `Type: ${mention.bot ? 'Bot' : 'Human'}\n\n`
            );

        if (isMemberInServer) {
            userlol.addField(`Server Related Information`,
                `Top Role: ${topRole}\n` +
                `Roles: ${mention.roles.cache.size > 1 ? mention.roles.cache.filter(r => r.name !== '@everyone').map(role => role).join(', ') : 'None'}\n` +
                `Key Permissions: ${finalPermissions.length ? finalPermissions.map(permission => `\`${permission}\``).join(', ') : 'None'}\n\n`
            );
        } else {
            userlol.addField(`Misc Information`,
                `Created On: ${moment(mention.createdTimestamp).format('llll')}\n` +
                `This user is not in this server.\n\n`
            );
        }

        userlol.setColor(client.color)
            .setFooter(`Requested By: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [userlol] });
    }
};

function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
