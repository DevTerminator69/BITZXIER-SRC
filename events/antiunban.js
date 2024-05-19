module.exports = async (client) => {
    client.on('guildBanRemove', async (member) => {
        let check =  await client.util.BlacklistCheck(member.guild)
        if(check) return  
        const auditLogs = await member.guild
            .fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_REMOVE' })
            .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp
        if (difference > 3600000) return
        await client.db
            ?.get(`${member.guild.id}_${executor?.id}_wl`)
            .then(async (data) => {
                const antinuke = await client.db.get(
                    `${member.guild.id}_antinuke`
                )
                if (antinuke !== true) return
                if (data) {
                    if (data.ban) return
                }
                if (executor.id === member.guild.ownerId) return
                if (executor.id === client.user.id) return
                try {
                    executor.guild = member.guild
                    target.guild = member.guild
                    await client.util
                        .FuckYou(executor, 'Member Unban | Unwhitelisted User')
                        .catch((err) => null)
                    await client.util
                        .FuckYou(target, 'Unban by Un-Whitelisted member')
                        .catch((err) => null)
                } catch (err) {
                    if (err.code === 429) {
                        await client.util.handleRateLimit()
                    }
                    return
                }
            })
    })
}
