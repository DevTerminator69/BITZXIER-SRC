const {  MessageEmbed } = require("discord.js");
const wait = require('wait')

module.exports = async (client) => {

client.on("channelCreate", async (channel) => {
  let check =  await client.util.BlacklistCheck(channel.guild)
  if(check) return   
  let data = await client.db.get(`logs_${channel.guild.id}`);
  if(!data) return;
  if(!data.channel) return;
  const cchannel = data.channel;
  const channellog = await channel.guild.channels.cache.get(cchannel);
if(!channellog) { 
  await client.db.set(`logs_${channel.guild.id}`,{ 
    voice : data ? data.voice : null,
    channel : null,
    rolelog : data ? data.rolelog : null,
    modlog : data ? data.modlog : null,   
    message : data ? data.message : null,
    memberlog : data ? data.memberlog : null
})
return;
}
  const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_CREATE' });
  const logs = auditLogs.entries.first();
 const { executor, target, createdTimestamp } = logs;
  let = difference = Date.now() - createdTimestamp;
  if (difference > 5000 ) return;  
  if(executor.id === client.user.id) return
if(data) {
  const channelType = channel.type === 'GUILD_TEXT' ? 'TEXT CHANNEL' :
  channel.type === 'GUILD_VOICE' ? 'VOICE CHANNEL' :
  channel.type === 'GUILD_CATEGORY' ? 'CATEGORY CHANNEL' :
  channel.type === 'GUILD_NEWS' ? 'NEWS CHANNEL' :
  channel.type === 'GUILD_STORE' ? 'STORE CHANNEL' :
  'UNKNOWN CHANNEL TYPE';
   const channelcreate = new MessageEmbed()
   channelcreate.setAuthor(executor.tag,executor.displayAvatarURL({ dynamic : true }))
  channelcreate.addFields([
    {
        name: `Channel Name`,
        value: `${channel.name}`
    },
    {
        name: `Channel Mention`,
        value: `<#${channel.id}>`
    },
  {
    name: `Channel Id`,
    value: `${channel.id}`

  },
  {
    name : `Channel Category`,
    value: ` ${channel.parent ? channel.parent.name : "No Category"}`
  },
{
  name : `Created By`,
  value: `${executor}\n`
},
{
name : `User Id`,
value : `${executor.id}`
},
{
  name : `Time`,
  value : `<t:${Math.round(channel.createdTimestamp / 1000)}:R>`
},
{
  name : `Channel Type`,
  value: `\`${channelType}\``
}
])
   channelcreate.setThumbnail(`${executor.displayAvatarURL({dynamic: true})}`)

    channelcreate.setColor(client.color)
  channelcreate.setFooter(channel.guild.name, channel.guild.iconURL({dynamic : true }))
    channelcreate.setTimestamp()
    await wait(2000);
    await channellog.send({ embeds : [channelcreate]}).catch((_) => { });
}
});

client.on("channelDelete", async (channel) => {
  let check =  await client.util.BlacklistCheck(channel.guild)
  if(check) return   
   let data = await client.db.get(`logs_${channel.guild.id}`);
    if(!data) return;
    if(!data.channel) return;
    const cchannel = data.channel;
  const channellog = await channel.guild.channels.cache.get(cchannel);
if(!channellog) { 
  await client.db.set(`logs_${channel.guild.id}`,{ 
    voice : data ? data.voice : null,
    channel : null,
    rolelog : data ? data.rolelog : null,
    modlog : data ? data.modlog : null,   
    message : data ? data.message : null,
    memberlog : data ? data.memberlog : null
})
return;
}
const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_DELETE' });
const logs = auditLogs.entries.first();
const { executor, target, createdTimestamp } = logs;
  let = difference = Date.now() - createdTimestamp;
  if (difference > 5000 ) return;  

  if(executor.id === client.user.id) return
  if(data) {
    const channelType = channel.type === 'GUILD_TEXT' ? 'TEXT CHANNEL' :
    channel.type === 'GUILD_VOICE' ? 'VOICE CHANNEL' :
    channel.type === 'GUILD_CATEGORY' ? 'CATEGORY CHANNEL' :
    channel.type === 'GUILD_NEWS' ? 'NEWS CHANNEL' :
    channel.type === 'GUILD_STORE' ? 'STORE CHANNEL' :
    'UNKNOWN CHANNEL TYPE';
   const channeldelete = new MessageEmbed()
   channeldelete.setAuthor(executor.tag,executor.displayAvatarURL({dynamic : true}))
   channeldelete.addFields([
    {
        name: `Channel Name`,
        value: `${channel.name}`
    },
    {
        name: `Channel Mention`,
        value: `<#${channel.id}>`
    },
  {
    name: `Channel Id`,
    value: `${channel.id}`

  },
  
{
  name : `Removed By`,
  value: `${executor}\n`
},
{
name : `User Id`,
value : `${executor.id}`
},
{
  name : `Time`,
  value : `<t:${Math.round(logs.createdTimestamp  / 1000)}:R>`
},
{
  name : `Channel Type`,
  value: `\`${channelType}\``
}
])
   channeldelete.setThumbnail(`${executor.displayAvatarURL({dynamic: true})}`)

    channeldelete.setColor(client.color)
  channeldelete.setFooter(channel.guild.name, channel.guild.iconURL({dynamic : true }))
    channeldelete.setTimestamp()
    await wait(2000);
    await channellog.send({ embeds : [channeldelete]}).catch((_) => { });
    }
  });

  client.on("channelUpdate", async (o, n) => {
   let check =  await client.util.BlacklistCheck(o.guild)
   if(check) return
    let data = await client.db.get(`logs_${o.guild.id}`);
    if(!data) return;
    if(!data.channel) return;
    const channel = data.channel;
    const channellog = await o.guild.channels.cache.get(channel);
    if(!channellog) { 
      await client.db.set(`logs_${o.guild.id}`,{ 
        voice : data ? data.voice : null,
      channel : null,
      rolelog : data ? data.rolelog : null,
      modlog : data ? data.modlog : null,   
      message : data ? data.message : null,
      memberlog : data ? data.memberlog : null
  })
  return;
  }
    const auditLogs = await n.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_UPDATE" });
    const logs = auditLogs.entries.first();
   const { executor, target, createdTimestamp } = logs;
    let = difference = Date.now() - createdTimestamp;
    if (difference > 5000 ) return;  
    if(executor.id === client.user.id) return

    const oldName = o.name;
      const newName = n.name;
   const oldNsfw = o.nsfw;
        const newNsfw = n.nsfw;
    const oldTopic = o.topic;
        const newTopic = n.topic;
    const oldrtcRegion = o.rtcRegion;
        const newrtcRegion = n.rtcRegion;
  const oldbitrate = o.bitrate;
        const newbitrate = n.bitrate;
    const olduserLimit = o.userLimit;
        const newuserLimit = n.userLimit;
    const oldvideoQualityMode = o.videoQualityMode;
        const newvideoQualityMode = n.videoQualityMode;
    const oldcooldown = o.rateLimitPerUser;
    const newcooldown = n.rateLimitPerUser;
    

  const newbitratevalue = n.bitrate / 1000
  const oldbitratevalue = o.bitrate / 1000
  
  if(data){
    const channelupdate = new MessageEmbed()
  
    channelupdate.setAuthor(executor.tag,executor.displayAvatarURL({ dynamic : true }))
    channelupdate.setTimestamp()
    channelupdate.setDescription(`${o.type === 'GUILD_TEXT' ? 'Text' : 'Voice'} Channel <#${n.id}> updated by ${executor}\n`)
    channelupdate.setColor(client.color)
    if(oldName !== newName ) channelupdate.addFields(
          { name: 'Channel Renamed', value: `\`${o.name}\` -> \`${n.name}\``,inline: false },
      )
      if(oldNsfw !== newNsfw ) channelupdate.addFields(
          { name: 'Channel NSFW State Updated', value: `\`${o.nsfw}\` -> \`${n.nsfw}\``,inline: false },
      )
     if(oldcooldown !== newcooldown ) channelupdate.addFields(
          { name: 'Channel Slowmode Updated', value: `\`${o.rateLimitPerUser} seconds \` -> \`${n.rateLimitPerUser} seconds \``,inline: false },
      )
     if(oldTopic !== newTopic ) channelupdate.addFields(
          { name: 'Channel Topic Updated', value: `\`${o.topic} \` -> \`${n.topic} \``,inline: false },
      )
      if(oldrtcRegion !== newrtcRegion ) channelupdate.addFields(
          { name: 'Channel Voice Region Updated', value: `\`${o.rtcRegion} \` -> \`${n.rtcRegion} \``,inline: false },
      )
     if(oldbitrate !== newbitrate ) channelupdate.addFields(
          { name: 'Channel Voice Bitrate Updated', value: `\`${oldbitratevalue} Kbps\` -> \`${newbitratevalue} Kbps\``,inline: false },
      )
       if(olduserLimit !== newuserLimit ) channelupdate.addFields(
          { name: 'Channel Voice UserLimit Updated', value: `\`${o.userLimit} users\` -> \`${n.userLimit} users\``,inline: false },
      )
      
    else if (o.type === 'GUILD_VOICE') {
    channelupdate.addFields(
          { name: 'Channel Voice Updated', value: `Channel Video Quality Mode Updated`,inline: false },
      )}
      channelupdate.addFields(
        { name: 'Updated At', value: `<t:${Math.round(logs.createdTimestamp  / 1000)}:R>`,inline: false },
    )
      await wait(2000);
      await channellog.send({ embeds : [channelupdate]}).catch((_) => { });
  
    
      }
  
    
  
  }) 

}


