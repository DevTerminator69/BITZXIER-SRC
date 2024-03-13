module.exports = async (client) => {
    client.on('guildAuditLogEntryCreate', async (audit) => {
        const { executor, target } = audit
        await client.db?.get(`${audit.target?.guild.id}_${executor?.id}_wl`).then(async (data) => {
            const antinuke = await client.db?.get(`${audit.target?.guild?.id}_antinuke`)
        if (antinuke !== true) return;
        if(data){
            if(data.serverup) return;
                }

        if (audit.action == 'AUTO_MODERATION_RULE_CREATE') {
            if (executor.id === audit.target.guild.ownerId) return
            if (executor.id === client.user.id) return
            const member = client.guilds.cache
                .get(audit.target?.guild?.id)
                .members.cache.get(executor.id)
                await target.delete()
            if (member) {
                if (member.bannable) {
                    member
                        .ban({ reason: 'Auto Moderation Rule Create | Not Whitelisted' })
                        .catch((err) => null)
                }
            }
        }
    })
})
}
