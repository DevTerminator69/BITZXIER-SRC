module.exports = async (client) => {
    client.on('channelDelete', async (channel) => {
        const auditLogs = await channel.guild
        .fetchAuditLogs({ limit: 2, type: 'CHANNEL_DELETE' })
        .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp; 
        if (difference > 3600000) return
        await client.db?.get(`${channel.guild.id}_${executor?.id}_wl`).then(async (data) => {
            const antinuke = await client.db.get(`${channel.guild.id}_antinuke`);
            if (antinuke !== true) return;
            if(data){
        if(data.chdl) return;
            }
            if (executor.id === channel.guild.ownerId) return
            if (executor.id === client.user.id) return
            try {
                executor.guild = channel.guild
                await client.util.FuckYou(
                    executor,
                    'Channel Delete | Not Whitelisted'
                )
                await channel.clone().then((ch) => ch.setPosition(channel.position))
            } catch (err) {
                return
            }
        })
    })
}
