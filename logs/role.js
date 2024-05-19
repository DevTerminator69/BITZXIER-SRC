const {  MessageEmbed, Permissions} = require("discord.js");
const wait = require('wait')

module.exports = async (client) => {
  client.on("roleCreate", async (role) => {
    let check =  await client.util.BlacklistCheck(role.guild)
    if(check) return 
  let data = await client.db.get(`logs_${role.guild.id}`);
  if(!data) return;
  if(!data.rolelog) return;
  const channel = data.rolelog;
  const rolelog = await role.guild.channels.cache.get(channel);
if(!rolelog) { 
  await client.db.set(`logs_${role.guild.id}`,{ 
    voice : data ? data.voice : null,
    channel : data ? data.channel : null,
    rolelog : null,
    modlog : data ? data.modlog : null,   
    message : data ? data.message : null,
    memberlog : data ? data.memberlog : null
})
return;
}
  const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_CREATE' });
  const logs = auditLogs.entries.first();
 const { executor, target, createdTimestamp } = logs;
  let = difference = Date.now() - createdTimestamp;
  if (difference > 5000 ) return;
if (data) {
  const roleCreateEmbed = new MessageEmbed()
  .setAuthor(`${executor.tag}`, executor.displayAvatarURL({ dynamic: true }))
  .setTitle(`Role Created: ${role.name}`)
  .setDescription(`**Role Information:**\n\n` +
      `- Role Name: ${role.name}\n` +
      `- Role ID: ${role.id}\n` +
      `- Displayed separately: ${role.hoist ? 'Yes' : 'No'}\n` +
      `- Mentionable: ${role.mentionable ? 'Yes' : 'No'}\n` +
      `- Role Position: ${role.position}\n` +
      `- Created By: ${executor.tag} (${executor.id})\n\n` +
      `**Role Permissions:**\n\n` +
      `${role.permissions.toArray().map(perm => `- ${perm}`).join('\n')}\n`)
  .setColor(role.hexColor)
  .setThumbnail(executor.displayAvatarURL({ dynamic: true }))
  .setFooter(`${role.guild.name}`, role.guild.iconURL({ dynamic: true }))
  .setTimestamp();


  await wait(2000);
  await rolelog.send({ embeds: [roleCreateEmbed] }).catch((_) => { });

} 

})

client.on("roleDelete", async (role) => {
  let check =  await client.util.BlacklistCheck(role.guild)
  if(check) return    
    let data = await client.db.get(`logs_${role.guild.id}`);
    if(!data) return;
    if(!data.rolelog) return;
    const channel = data.rolelog;
    const rolelog = await role.guild.channels.cache.get(channel);
  if(!rolelog) {
     await client.db.set(`logs_${role.guild.id}`,{ 
      voice : data ? data.voice : null,
    channel : data ? data.channel : null,
    rolelog : null,
    modlog : data ? data.modlog : null,   
    message : data ? data.message : null,
    memberlog : data ? data.memberlog : null
})
return;
  }
    const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_DELETE' });
    const logs = auditLogs.entries.first();
   const { executor, target, createdTimestamp } = logs;
    let = difference = Date.now() - createdTimestamp;
    if (difference > 5000 ) return;
  if(data) {
    const roleDeleteEmbed = new MessageEmbed()
    .setAuthor(`Role Deleted`, executor.displayAvatarURL({ dynamic: true }))
    .setTitle(`Role: ${role.name}`)
    .setDescription(`**Role Information:**\n\n` +
        `- Role Name: ${role.name}\n` +
        `- Role ID: ${role.id}\n` +
        `- Displayed separately: ${role.hoist ? 'Yes' : 'No'}\n` +
        `- Mentionable: ${role.mentionable ? 'Yes' : 'No'}\n` +
        `- Deleted By: ${executor.tag} (${executor.id})\n\n` +
        `**Role Permissions:**\n\n` +
        `${role.permissions.toArray().map(perm => `- ${perm}`).join('\n')}\n`)
    .setColor("#ff0000") // You can customize the color as per your preference, here it's red
    .setThumbnail(executor.displayAvatarURL({ dynamic: true }))
    .setFooter(`${role.guild.name}`, role.guild.iconURL({ dynamic: true }))
    .setTimestamp();


    await wait(2000);
    await rolelog.send({ embeds: [roleDeleteEmbed] }).catch((_) => { });
  }
    
  }
  )


  client.on("roleUpdate", async (o, n) => {
    let check =  await client.util.BlacklistCheck(o.guild)
    if(check) return  
    let data = await client.db.get(`logs_${o.guild.id}`);
    if(!data) return;
    if(!data.rolelog) return;
    const channel = data.rolelog;
    const rolelog = await o.guild.channels.cache.get(channel);
    if (!rolelog) { 
      await client.db.set(`logs_${o.guild.id}`, {
        voice : data ? data.voice : null,
      channel: data ? data.channel : null,
      rolelog: null,
      modlog: data ? data.modlog : null,
      message: data ? data.message : null,
      memberlog: data ? data.memberlog : null,
    })
    return;
  }
    const auditLogs = await n.guild.fetchAuditLogs({ limit: 1, type: "ROLE_UPDATE" });
    const logs = auditLogs.entries.first();
    const { executor, target, createdTimestamp } = logs;
    let difference = Date.now() - createdTimestamp;
    if (difference > 5000) return;
  
    if (data) {
      const rolename = new MessageEmbed();
      rolename.setColor(client.color)
      rolename.setAuthor(`Role Update`, executor.displayAvatarURL({ dynamic: true }));
      rolename.setThumbnail(executor.displayAvatarURL({ dynamic: true }));
      rolename.setDescription(`Role : ${o}\n\nRole Id : ${o.id}\n\nExecutor : ${executor.tag}\n\nExecutor Id : ${executor.id}\n`);
      if (o.name !== n.name) rolename.addFields({ name: 'Name', value: `Old Name : \`${o.name}\` New Name : \`${n.name}\``, inline: false });
      if (o.color !== n.color) rolename.addFields({ name: 'Color', value: `Old Color : \`${o.color}\` New Color : \`${n.color}\``, inline: false });
      if (o.hoist !== n.hoist) rolename.addFields({ name: 'Display', value: `Old Display : \`${o.hoist}\` New Display : \`${n.hoist}\``, inline: false });
      if (o.mentionable !== n.mentionable) rolename.addFields({ name: 'Mentionable', value: `Old Mentionable : \`${o.mentionable}\` New Mentionable : \`${n.mentionable}\``, inline: false });
      const oldPermissions = o.permissions instanceof Permissions ? o.permissions.toArray().map(permission => `\`${permission}\``).join(', ') : 'No Permissions';
      const newPermissions = n.permissions instanceof Permissions ? n.permissions.toArray().map(permission => `\`${permission}\``).join(', ') : 'No Permissions';
    if(n.permissions !== o.permissions) rolename.addFields({ name: 'Permissions', value: `Old Permissions : ${oldPermissions ? oldPermissions : '\`No Permissions\`'}\n\nNew Permissions : ${newPermissions ? newPermissions : '\`No Permissions\`'}`, inline: false });
      
      rolename.setFooter(n.guild.name, n.guild.iconURL({ dynamic: true }));
      rolename.setTimestamp();
      await wait(2000);
      await rolelog.send({ embeds: [rolename] }).catch((_) => { });
    }
  });

   }
