const {  MessageEmbed, Permissions} = require("discord.js");
const wait = require('wait')

module.exports = async (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
      let check =  await client.util.BlacklistCheck(oldState.guild)
      if(check) return  
         let data = await client.db.get(`logs_${oldState.guild.id}`);
        if(!data) return;
        if(!data.voice) return;
        const channel = data.voice;
        const voicelog = await oldState.guild.channels.cache.get(channel);
        if (!voicelog) { 
          await client.db.set(`logs_${oldState.guild.id}`, {
            voice : null,
          channel: data ? data.channel : null,
          rolelog: data ? data.rolelog : null,
          modlog: data ? data.modlog : null,
          message: data ? data.message : null,
          memberlog: data ? data.memberlog : null,
        })
        return;
      }
        const member = newState.member;
    
        if (!oldState.channelId && newState.channelId) {
            const joinedChannel = newState.channel.name || 'NONE';
    
            const joinEmbed = new MessageEmbed()
                .setColor(client.color) 
                .setThumbnail(member.displayAvatarURL({ dyanmic : true}))
                .setTitle('Member Joined Voice Channel')
                .setDescription(`${member.user.tag} joined voice channel "${joinedChannel}"`)
                .addFields({name :'Channel',value : joinedChannel })
                .setFooter({ text : `${member.user.tag} joined voice channel`, iconURL : member.displayAvatarURL({ dyanmic : true})})
                .setTimestamp();

                await wait(2000);
                voicelog.send({ embeds: [joinEmbed] }).catch((err) => null)
        }
    
        if (oldState.channelId && !newState.channelId) {
            const leftChannel = oldState.channel.name || 'NONE';
    
            const leaveEmbed = new MessageEmbed()
                .setColor(client.color) 
                .setThumbnail(member.displayAvatarURL({ dyanmic : true}))
                .setTitle('Member Left Voice Channel')
                .setDescription(`${member.user.tag} left voice channel "${leftChannel}"`)
                .addFields({ name : 'Channel', value : leftChannel })
                .setFooter({ text : `${member.user.tag} Leaved voice channel`, iconURL : member.displayAvatarURL({ dyanmic : true})})
                .setTimestamp();

await wait(2000);
await voicelog.send({ embeds: [leaveEmbed] }).catch((err) => null)
        }
    
        if (oldState.channelId !== newState.channelId) {
            const oldChannel = oldState.channel ? oldState.channel.name : 'NONE';
            const newChannel = newState.channel ? newState.channel.name : 'NONE';
    
            const moveEmbed = new MessageEmbed()
                .setColor(client.color) 
                .setThumbnail(member.displayAvatarURL({ dyanmic : true}))
                .setTitle('Member Moved Voice Channels')
                .setDescription(`${member.user.tag} moved from "${oldChannel}" to "${newChannel}"`)
                .addFields({ name : 'From',value : oldChannel })
                .addFields({ name : 'To', value : newChannel})
                .setFooter({ text : `${member.user.tag} got moved from voice`, iconURL : member.displayAvatarURL({ dyanmic : true})})
                .setTimestamp();

                await wait(2000);
                await voicelog.send({ embeds: [moveEmbed] }).catch((err) => null)
        }
    });    
   }
