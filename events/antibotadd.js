const { MessageEmbed } = require('discord.js')

module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {
        let check =  await client.util.BlacklistCheck(member.guild)
        if(check) return  
        const auditLogs = await member.guild
            .fetchAuditLogs({ limit: 1, type: 'BOT_ADD' })
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
                    if (data.botadd) return
                }
                if (executor.id === member.guild.ownerId) return
                if (executor.id === client.user.id) return
                if (!target.bot) return
                if (target.id !== member.id) return
                try {
                    executor.guild = member.guild
                    target.guild = member.guild
                    await client.util.FuckYou(
                        executor,
                        'Bot Add | Unwhitelisted User'
                    );
                    await client.util
                        .FuckYou(target, 'Illegal Bot | Unwhitelisted User');
                } catch (err) {
                    if (err.code === 429) {
                        await client.util.handleRateLimit()
                    }
                    return
                }
            })
    })
}
