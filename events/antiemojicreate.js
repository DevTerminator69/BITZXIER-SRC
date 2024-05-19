module.exports = async (client) => {
    client.on('emojiCreate', async (emoji) => {
        let check =  await client.util.BlacklistCheck(emoji.guild)
        if(check) return  
        const auditLogs = await emoji.guild
            .fetchAuditLogs({ limit: 2, type: 'EMOJI_CREATE' })
            .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp
        if (difference > 3600000) return
        await client.db
            ?.get(`${emoji.guild.id}_${executor?.id}_wl`)
            .then(async (data) => {
                const antinuke = await client.db.get(
                    `${emoji.guild.id}_antinuke`
                )
                if (antinuke !== true) return
                if (data) {
                    if (data.mngstemo) return
                }
                if (executor.id === emoji.guild.ownerId) return
                if (executor.id === client.user.id) return
                try {
                    executor.guild = emoji.guild
                    await client.util
                        .FuckYou(executor, 'Emoji Create | Unwhitelisted User')
                        .catch((err) => null)
                    await emoji.delete().catch((_) => {})
                } catch (err) {
                    if (err.code === 429) {
                        await client.util.handleRateLimit()
                    }
                    return
                }
            })
    })
}
