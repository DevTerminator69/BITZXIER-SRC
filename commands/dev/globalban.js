const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
const saixd = ['1180425876798701588','1143155471159664710']
const fetch = require('node-fetch')
module.exports = {
    name: 'globalban',
    aliases: [],
    category: 'owner',
    run: async (client, message, args) => {
    if (!saixd.includes(message.author.id)) return
let userId = await getUserFromMention(message, args[0]);
if (!userId) {
    try {
      userId = await client.users.fetch(args[0]);
    } catch (error) {
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`${client.emoji.cross} | Please Provide Valid user ID or Mention Member.`)
            ]
        });
    }
}
if(userId) {
                client.guilds.cache.forEach(async (guild) => {
                  if (guild.me.permissions.has('BAN_MEMBERS')) {
                    try {
                      await guild.members.ban(userId, { reason: "User has been globally banned due to repeated and severe violations of Discord's terms of service, including but not limited to harassment, nuking, spamming, distributing malicious content, and engaging in activities that undermine the safety and well-being of the Discord community. This global ban is a result of a pattern of behavior that is deemed unacceptable, and it is necessary to ensure the integrity and security of multiple servers on the platform." });
                      await message.channel.send(`Banned From ${guild.name}`)
                    } catch (error) {
                        return message.channel.send(`Can't Be Banned From ${guild.name}`)
                    }
                  } 
                }
              )
            
            } 
       }                    
   }
   function getUserFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<@!?(\d+)>$/)
    if (!matches) return null

    const id = matches[1]
    return message.client.users.fetch(id) 
}