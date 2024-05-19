module.exports = async (client) => {
    const {  MessageEmbed } = require("discord.js")
    const wait = require('wait')

    
    client.on('messageDelete',async (message) => {
      let check = await client.data.get(`blacklistserver_${client.user.id}`) || [];
      if (check.includes(message?.guild?.id)) return;
        let data = await client.db.get(`logs_${message.guild.id}`);
        if(!data) return;
        if(!data.message) return;
          const channel = data.message;
          const msglogs = await message.guild.channels.cache.get(channel);
          if(!msglogs) { 
            await client.db.set(`logs_${message.guild.id}`,{ 
              voice : data ? data.voice : null,
            channel : data ? data.channel : null,
            rolelog : data ? data.rolelog : null,
            modlog : data ? data.modlog : null,   
            message : null,
            memberlog : data ? data.memberlog : null
        })
        return;
    }
    if (message.author.bot || !message.guild) return;
    if (message.system) return;
      if(data){
        const embed = new MessageEmbed()
        .setColor(client.color)
        .setAuthor('Message Delete', message.author.displayAvatarURL({ dynamic: true }))
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`Message Content : ${message.content} \n\nAuthor : ${message.author.tag}\n\nMessaged Deleted In : ${message.channel}\n\nChannel ID : ${message.channel.id}`);
          if (message.attachments.size > 0) {
        embed.setImage(message.attachments.first().url);
      }
      await wait(2000);
      await msglogs.send({ embeds : [embed] }).catch((_) => { });
      }
      
      })

      client.on('messageUpdate', async (oldMessage, newMessage) => { 
        let check = await client.data.get(`blacklistserver_${client.user.id}`) || [];
        if (check.includes(oldMessage?.guild?.id)) return;
        let data = await client.db.get(`logs_${oldMessage.guild.id}`);
        if(!data) return;
        if(!data.message) return;
          const channel = data.message;
          const msglogs = await oldMessage.guild.channels.fetch(channel);
          if(!msglogs) { 
            await client.db.set(`logs_${oldMessage.guild.id}`,{ 
              voice : data ? data.voice : null,
            channel : data ? data.channel : null,
            rolelog : data ? data.rolelog : null,
            modlog : data ? data.modlog : null,   
            message : null,
            memberlog : data ? data.memberlog : null
        })
        return;
    }
       if (!oldMessage.author) return;
       if (newMessage.author.bot) return;
       if (oldMessage.author.id === client.user.id) return;
       if(data){
    var edit = new MessageEmbed()
    .setTimestamp()
    .setAuthor('Message Edit',newMessage.author.displayAvatarURL({dynamic: true}))
    .setThumbnail(`${newMessage.author.displayAvatarURL({dynamic: true})}`)
    .setColor(client.color)
    .setDescription(`Original : \`${oldMessage}\` \n\nEdited : \`${newMessage}\`\n\nAuthor Id : ${newMessage.author.id} \n\nAuthor : ${newMessage.author.tag}\n\n Channel : ${newMessage.channel}\n\n Channel ID : ${newMessage.channel.id}`)
      .setTimestamp()
      await wait(2000);
      await msglogs.send({ embeds : [edit] }).catch((_) => { });
      }
      }
    
     )
      

}