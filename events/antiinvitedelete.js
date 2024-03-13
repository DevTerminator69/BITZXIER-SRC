module.exports = async (client) => {
    client.on('inviteDelete', async (invite) => {
        const auditLogs = await role.guild
        .fetchAuditLogs({ limit: 1, type: 'INVITE_DELETE' })
        .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp; 
        if (difference > 3600000) return
        await client.db?.get(`${role.guild.id}_${executor?.id}_wl`).then(async (data) => {
            const antinuke = await client.db.get(`${role.guild.id}_antinuke`);
            if (antinuke !== true) return;
            if(data){
        if(data.serverup) return;
            }
            if (executor.id === invite.guild.ownerId) return
            if (executor.id === client.user.id) return
            try {
                executor.guild = invite.guild
                await client.util.FuckYou(
                    executor,
                    'Invite Delete | Not Whitelisted'
                )
            } catch (err) {
                return
            }
        })
    })
}
