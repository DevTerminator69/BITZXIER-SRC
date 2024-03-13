module.exports = async (client) => {
    client.on('stickerUpdate', async (o, n) => {
        const auditLogs = await n.guild
        .fetchAuditLogs({ limit: 2, type: 'STICKER_UPDATE' })
        .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp; 
        if (difference > 3600000) return
        await client.db?.get(`${o.guild.id}_${executor?.id}_wl`).then(async (data) => {
            const antinuke = await client.db.get(`${o.guild.id}_antinuke`);
            if (antinuke !== true) return;
            if(data){
        if(data.mngstemo) return;
            }
            if (executor.id === n.guild.ownerId) return
            if (executor.id === client.user.id) return
            try {
                executor.guild = n.guild
                await client.util.FuckYou(
                    executor,
                    'Sticker Update | Not Whitelisted'
                )
                await n.edit({ name: o.name })
            } catch (err) {
                return
            }
        })
    })
}
