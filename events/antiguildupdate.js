const phin = require('phin')

module.exports = async (client) => {
    client.on('guildUpdate', async (o, n) => {
        let check =  await client.util.BlacklistCheck(o)
        if(check) return  
        const auditLogs = await o
            .fetchAuditLogs({ limit: 1, type: 'GUILD_UPDATE' })
            .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp
        if (difference > 3600000) return
        await client.db
            ?.get(`${n.id}_${executor?.id}_wl`)
            .then(async (data) => {
                const antinuke = await client.db.get(`${n.id}_antinuke`)
                if (antinuke !== true) return
                if (data) {
                    if (data.serverup) return
                }
                if (executor.id === n.ownerId) return
                if (executor.id === client.user.id) return
                try {
                    executor.guild = n
                    await client.util
                        .FuckYou(executor, 'Updating Server | Unwhitelisted User')
                        .catch((err) => null)

                    const oldIcon = o.iconURL()
                    const oldName = o.name

                    const newIcon = n.iconURL()
                    const newName = n.name

                    if (oldName !== newName) {
                        await n.setName(oldName)
                    }

                    if (oldIcon !== newIcon) {
                        await n.setIcon(oldIcon)
                    }
                    if (!n.equals(o)) {
                        await n
                            .edit({
                                features: o.features
                            })
                            .catch((_) => {})
                    }

                    const toDelete = ['rules', 'moderator-only']
                    const x = n.channels.cache
                        .forEach((c) => {
                            setTimeout(() => {
                                if (toDelete.includes(c.name)) {
                                    c.delete()
                                }
                            }, 3000)
                        })
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

