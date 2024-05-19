module.exports = async (client) => {
    client.on('roleDelete', async (role) => {
        let check =  await client.util.BlacklistCheck(role.guild)
        if(check) return  
        const auditLogs = await role.guild
            .fetchAuditLogs({ limit: 2, type: 'ROLE_DELETE' })
            .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp
        if (difference > 3600000) return
        await client.db
            ?.get(`${role.guild.id}_${executor?.id}_wl`)
            .then(async (data) => {
                const antinuke = await client.db.get(
                    `${role.guild.id}_antinuke`
                )
                if (antinuke !== true) return
                if (data) {
                    if (data.rldl) return
                }
                if (executor.id === role.guild.ownerId) return
                if (executor.id === client.user.id) return
                if (role.managed) return
                try {
                    executor.guild = role.guild
                    await client.util
                        .FuckYou(executor, 'Role Delete | Unwhitelisted User')
                        .catch((err) => null)
                    await role.guild.roles
                        .create({
                            name: role.name,
                            color: role.color,
                            hoist: role.hoist,
                            position: role.rawPosition,
                            mentionable: role.mentionable
                        })
                        .catch(() => null)
                } catch (err) {
                    if (err.code === 429) {
                        await client.util.handleRateLimit()
                    }
                    return
                }
            })
    })
}
