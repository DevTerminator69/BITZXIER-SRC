module.exports = async (client) => {
    client.on('webhookUpdate', async (webhook) => {
        let check =  await client.util.BlacklistCheck(webhook.guild)
        if(check) return  
                    const auditLogs = await webhook.guild
            .fetchAuditLogs({ limit: 2, type: 'WEBHOOK_UPDATE' })
            .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp
        if (difference > 3600000) return
        await client.db
            ?.get(`${webhook.guild.id}_${executor?.id}_wl`)
            .then(async (data) => {
                const antinuke = await client.db.get(
                    `${webhook.guild.id}_antinuke`
                )
                if (antinuke !== true) return
                if (data) {
                    if (data.mngweb) return
                }
                if (executor.id === webhook.guild.ownerId) return
                if (executor.id === client.user.id) return
                try {
                    executor.guild = webhook.guild
                    await client.util
                        .FuckYou(executor, 'Webhook update | Unwhitelisted User')
                        .catch((err) => null)
                    await logs.target.delete().catch((e) => null)
                } catch (err) {
                    if (err.code === 429) {
                        await client.util.handleRateLimit()
                    }
                    return
                }
            })
    })
}
