const { MessageEmbed } = require("discord.js");
const wait = require('wait')

module.exports = async (client) => { 

client.on("guildBanAdd", async (guild, user) => {
  let check =  await client.util.BlacklistCheck(guild.guild)
  if(check) return  
    let data = await client.db.get(`logs_${guild?.guild?.id}`);
    if(!data) return;
    if(!data.modlog) return;
    const channel = data.modlog;
    const modlog1 = await guild?.guild?.channels.cache.get(channel);
    if (!modlog1) { 
      await client.db.set(`logs_${guild?.guild?.id}`,{ 
        voice : data ? data.voice : null,
      channel : data ? data.channel : null,
      rolelog : data ? data.rolelog : null,
      modlog : null,   
      message : data ? data.message : null,
      memberlog : data ? data.memberlog : null
  })
  return;
}
  const auditLogs = await guild?.guild?.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_ADD' });
  const logs = auditLogs.entries.first();
 const { executor, target, createdTimestamp } = logs;
  let = difference = Date.now() - createdTimestamp;
  if (difference > 5000 ) return;
  if (data) {
    const banEmbed = new MessageEmbed();
    banEmbed.setColor(client.color)
    banEmbed.setThumbnail(target.displayAvatarURL({ dynamic: true }))
    banEmbed.setAuthor(`${target.username} was banned`,target.displayAvatarURL({ dynamic : true }));
    banEmbed.addField('Banned By',`${executor.tag} (${executor.id})`);
    banEmbed.setTimestamp();
    await wait(2000);
    await modlog1.send({ embeds: [banEmbed] }).catch((_) => { });
  }
});

client.on("guildBanRemove", async (guild, user) => {
  let check =  await client.util.BlacklistCheck(guild.guild)
  if(check) return  
    let data = await client.db.get(`logs_${guild?.guild?.id}`);
    if(!data) return;
    if(!data.modlog) return;
    const channel = data.modlog;
    const modlog1 = await guild?.guild?.channels.cache.get(channel);
    if (!modlog1) { 
      await client.db.set(`logs_${guild?.guild?.id}`,{
        voice : data ? data.voice : null, 
      channel : data ? data.channel : null,
      rolelog : data ? data.rolelog : null,
      modlog : null,   
      message : data ? data.message : null,
      memberlog : data ? data.memberlog : null
  })
  return;
}
  const auditLogs = await guild?.guild?.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_REMOVE' });
  const logs = auditLogs.entries.first();
 const { executor, target, createdTimestamp } = logs;
  let = difference = Date.now() - createdTimestamp;
  if (difference > 5000 ) return;
  if (data) {
    const unbanEmbed = new MessageEmbed();
    unbanEmbed.setColor(client.color)
    unbanEmbed.setThumbnail(target.displayAvatarURL({ dynamic: true }))
    unbanEmbed.setAuthor(`${target.username} was unbanned`,target.displayAvatarURL({ dynamic : true }));
    unbanEmbed.addField('Unbanned By', `${executor.tag} (${executor.id})`);
    unbanEmbed.setTimestamp();
    await wait(2000);
    await modlog1.send({ embeds: [unbanEmbed] }).catch((_) => { });
  }
});

client.on("guildMemberRemove", async (member) => {
  let check =  await client.util.BlacklistCheck(member.guild)
  if(check) return  
  let data = await client.db.get(`logs_${member.guild.id}`);
  if(!data) return;
  if(!data.modlog) return;
  const channel = data.modlog;
  const modlog1 = await member.guild.channels.cache.get(channel);
  if (!modlog1) { 
    await client.db.set(`logs_${member.guild.id}`,{ 
      voice : data ? data.voice : null,
    channel : data ? data.channel : null,
    rolelog : data ? data.rolelog : null,
    modlog : null,   
    message : data ? data.message : null,
    memberlog : data ? data.memberlog : null
})
return;
  }
  const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_KICK' });
  const logs = auditLogs.entries.first();
 const { executor, target, createdTimestamp } = logs;
  let = difference = Date.now() - createdTimestamp;
  if (difference > 5000 ) return;
  if (data) {
    const kickEmbed = new MessageEmbed()
        .setColor(client.color)
        .setAuthor(`${member.user.username} was kicked`, member.user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields({name :'Kicked By',value: `${executor.tag} (${executor.id})`})
        .setTimestamp();
        await wait(2000);
        await modlog1.send({ embeds: [kickEmbed] }).catch((_) => { });
  }
});
}