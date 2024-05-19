module.exports = async (client) => {
    client.on('channelCreate', async (channel) => {
        let check =  await client.util.BlacklistCheck(channel.guild)
        if(check) return  
        const auditLogs = await channel.guild
            .fetchAuditLogs({ limit: 2, type: 'CHANNEL_CREATE' })
            .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp
        if (difference > 3600000) return
        await client.db
            ?.get(`${channel.guild.id}_${executor?.id}_wl`)
            .then(async (data) => {
                const antinuke = await client.db.get(
                    `${channel.guild.id}_antinuke`
                )
                if (antinuke !== true) return
                if (data) {
                    if (data.chcr) return
                }
                if (executor.id === channel.guild.ownerId) return
                if (executor.id === client.user.id) return
                try {
                    executor.guild = channel.guild
                    await client.util
                        .FuckYou(executor, 'Channel Create | Unwhitelisted User')
                        .catch((err) => null)
                    await channel.delete().catch((_) => {})
                } catch (err) {
                    if (err.code === 429) {
                        await client.util.handleRateLimit()
                    }
                    return
                }
            })
    })
}
