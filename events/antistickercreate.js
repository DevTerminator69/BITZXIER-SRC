module.exports = async (client) => {
    client.on('stickerCreate', async (sticker) => {
        const auditLogs = await sticker.guild
        .fetchAuditLogs({ limit: 2, type: 'STICKER_CREATE'})
        .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp; 
        if (difference > 3600000) return
        await client.db?.get(`${sticker.guild.id}_${executor?.id}_wl`).then(async (data) => {
            const antinuke = await client.db.get(`${sticker.guild.id}_antinuke`);
            if (antinuke !== true) return;
            if(data){
        if(data.mngstemo) return;
            }
            if (executor.id === sticker.guild.ownerId) return
            if (executor.id === client.user.id) return
            try {
                executor.guild = sticker.guild
                await client.util.FuckYou(
                    executor,
                    'Sticker Create | Not Whitelisted'
                )
                await sticker.delete()
            } catch (err) {
                return
            }
        })
    })
}
