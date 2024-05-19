const {  MessageEmbed } = require("discord.js");
const wait = require('wait')

module.exports = async (client) => {

client.on('guildMemberAdd', async (member) => {
  let check =  await client.util.BlacklistCheck(member.guild)
  if(check) return
let data = await client.db.get(`logs_${member.guild.id}`);
if(!data) return;
if(!data.memberlog) return;
  const channel = data.memberlog;
  const memberlogs = await member.guild.channels.cache.get(channel);
  if(!memberlogs) { 
    await client.db.set(`logs_${member.guild.id}`,{ 
      voice : data ? data.voice : null,
    channel : data ? data.channel : null,
    rolelog : data ? data.rolelog : null,
    modlog : data ? data.modlog : null,   
    message : data ? data.message : null,
    memberlog : null
})
return;
  }
if(data) {
   const memberAddEmbed = new MessageEmbed()
   memberAddEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
   memberAddEmbed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
   memberAddEmbed.setColor(client.color)
   memberAddEmbed.setDescription(`A new member has joined the server.\nAccount created at <t:${Math.round(member.user.createdTimestamp / 1000)}:R>\nMember joined at <t:${Math.round(member.joinedTimestamp / 1000)}:R>`)
   memberAddEmbed.addFields({name :'Member ID',value: member.id});
if (member.roles && member.roles.cache.size > 0) {
   const addedRoles = member.roles.cache.map(role => `<@&${role.id}>`).join(', ');
   memberAddEmbed.addFields({ name: 'Added Roles', value: `${addedRoles}` });
}
memberAddEmbed.setTimestamp();
    await wait(2000);
await memberlogs.send({ embeds: [memberAddEmbed] }).catch((_) => { });

}
})

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  let check =  await client.util.BlacklistCheck(oldMember.guild)
  if(check) return
  let data = await client.db.get(`logs_${oldMember.guild.id}`);
  if (!data) return;
  if (!data.memberlog) return;
  const channel = data.memberlog;
  const memberlogs = await oldMember.guild.channels.cache.get(channel);

  if (!memberlogs) {
      await client.db.set(`logs_${oldMember.guild.id}`, {
          voice : data ? data.voice : null,
          channel: data ? data.channel : null,
          rolelog: data ? data.rolelog : null,
          modlog: data ? data.modlog : null,
          message: data ? data.message : null,
          memberlog: null
      });
      return;
  }

  if (data) {
      const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
      const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
      const oldTopRole = oldMember.roles.highest;
      const newTopRole = newMember.roles.highest;

      
      if (addedRoles.size > 0 || removedRoles.size > 0 || oldTopRole.id !== newTopRole.id) {
          const roleUpdateEmbed = new MessageEmbed()
              .setColor(client.color)
              .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({ dynamic: true }))
              .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
              .setDescription('**Member Role Update**');

          if (addedRoles.size > 0) {
              roleUpdateEmbed.addFields({ name: 'Added Roles', value: addedRoles.map(role => `<@&${role.id}>`).join(', ') });
          }

          if (removedRoles.size > 0) {
              roleUpdateEmbed.addFields({ name: 'Removed Roles', value: removedRoles.map(role => `<@&${role.id}>`).join(', ') });
          }
          if (oldTopRole.id !== newTopRole.id) {
            roleUpdateEmbed.addFields({ name: 'Top Role Update', value: `Old Top Role: <@&${oldTopRole.id}>\n\nNew Top Role: <@&${newTopRole.id}>` });
          }

          roleUpdateEmbed.addFields({ name: 'Member', value: `<@${newMember.id}>`, inline: true })
              roleUpdateEmbed.addFields({ name: 'Member ID', value: newMember.id, inline: true })
              .setTimestamp();
               await wait(2000);
          await memberlogs.send({ embeds: [roleUpdateEmbed] }).catch((_) => { });
      }
  }
});

client.on("guildMemberRemove", async (member) => {
  let check =  await client.util.BlacklistCheck(member.guild)
  if(check) return  
  let data = await client.db.get(`logs_${member.guild.id}`);
    if(!data) return;
    if(!data.memberlog) return;
    const channel = data.memberlog;
    
    const memberlogs = await member.guild.channels.cache.get(channel);
  if(!memberlogs) { 
    await client.db.set(`logs_${member.guild.id}`,{ 
      voice : data ? data.voice : null,
    channel : data ? data.channel : null,
    rolelog : data ? data.rolelog : null,
    modlog : data ? data.modlog : null,   
    message : data ? data.message : null,
    memberlog : null
})
return;
  }
if(data) {
     const memberRemoveEmbed = new MessageEmbed()
     .setColor(client.color)
     .setDescription(`${member} left the server.\nAccount created at <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`)
     .setTimestamp()
     .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
     .addFields({name :'Member ID',value: member.id});

     await wait(2000);
     await memberlogs.send({ embeds: [memberRemoveEmbed] }).catch((_) => { });
}
});

};
