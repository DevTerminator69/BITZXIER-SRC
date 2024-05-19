const { Message, Client, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
module.exports = {
    name: 'roleicon',
    category: 'info',
    premium: true,
    run: async (client, message, args) => {
        const aastik = new MessageEmbed().setColor(client.color)
        let own = message.author.id == message.guild.ownerId
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.channel.send({
                embeds: [
                    aastik
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
                    aastik
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
                    aastik
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }
        
const check = parseInt(message.guild.premiumTier.split("_")[1]);
    if(message.guild.premiumTier === "NONE") return message.channel.send({embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | Your Server Doesn't Meet The **Roleicon Requirements**. Servers with level **2** boosts are allowed to set role icons`)]})
    
    if(check < 2)
      return message.channel.send({embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | Your Server Doesn't Meet The **Roleicon** Requirements. Servers with level **2** boosts are allowed to set role icons`)]})
 if(!args[0]) return message.channel.send({embeds:[new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | ${message.guild.prefix}roleicon <role> <emoji>`)]});
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role) return message.channel.send({embeds:[new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | Provide valid role.`)]})
    if(role && !role.editable) {
        return message.channel.send({embeds:[new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | ${role} is having higher position than my role`)]});    
    }
    if(role.iconURL() && !args[1]){
        try  {
      role.setIcon(null)
    const embed = new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.tick} | Successfully Removed Icon From ${role}`)
    return message.channel.send({ embeds: [embed] })
     }catch(err) {
        return message.channel.send({embeds:[new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | ${role} is having higher position than my role`)]});    
     } 
    } 
    if(!args[1]) return message.channel.send({embeds:[new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | Provide **provide** an emoji.`)]})
    const emojiRegex = /<a?:\w{2,}:\d{17,20}>/g;
    if(!args[1].match(emojiRegex)) return message.channel.send({embeds:[new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | Provide provide a **valid** emoji.`)]})
    const emojiID = args[1].replace(/[^0-9]/g, '');
    const baseUrl = `https://cdn.discordapp.com/emojis/${emojiID}`;
    try {
        await role.setIcon(baseUrl).catch(err => null)
     const embed = new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.tick} | Successfully Iconified the ${role}`)
    return message.channel.send({ embeds: [embed] })
     } catch(err) {
        return message.channel.send({embeds:[new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | ${role} is having higher position than my role`)]});    
      }

      }

  }
