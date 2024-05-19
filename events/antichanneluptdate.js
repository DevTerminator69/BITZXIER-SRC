module.exports = async (client) => {
    client.on('channelUpdate', async (o, n) => {
        let check =  await client.util.BlacklistCheck(o.guild)
        if(check) return  
            const auditLogs = await n.guild
            .fetchAuditLogs({ limit: 2, type: 'CHANNEL_UPDATE' })
            .catch((_) => {})
        const logs = auditLogs?.entries?.first()
        if (!logs) return
        const { executor, target, createdTimestamp } = logs
        let = difference = Date.now() - createdTimestamp
        if (difference > 3600000) return
        await client.db
            ?.get(`${o.guild.id}_${executor?.id}_wl`)
            .then(async (data) => {
                const antinuke = await client.db.get(`${o.guild.id}_antinuke`)
                if (antinuke !== true) return
                if (data) {
                    if (data.chup) return
                }

                if (executor.id === o.guild.ownerId) return
                if (executor.id === client.user.id) return

                const oldName = o.name
                const newName = n.name
                try {
                    executor.guild = n.guild
                    await client.util
                        .FuckYou(executor, 'Channel Update | Unwhitelisted User')
                        .catch((err) => null)
                    async function textChannelUpdate() {
                        await n
                            .edit({
                                name: o.name,
                                topic: o.topic,
                                rateLimitPerUser: o.rateLimitPerUser,
                                nsfw: o.nsfw
                            })
                            .catch(() => null)
                    }
                    async function catChannelUpdate() {
                        await n
                            .edit({
                                name: o.name
                            })
                            .catch(() => null)
                    }
                    async function voiceChannelUpdate() {
                        await n
                            .edit({
                                name: o.name,
                                rtcRegion: o.rtcRegion,
                                videoQualityMode: o.videoQualityMode,
                                userLimit: o.userLimit,
                                bitrate: o.bitrate,
                                rateLimitPerUser: o.rateLimitPerUser,
                                nsfw: o.nsfw
                            })
                            .catch(() => null)
                    }

                    if (n.isText()) {
                        await textChannelUpdate()
                    }
                    if (n.type === 'GUILD_CATEGORY') {
                        await catChannelUpdate()
                    }
                    if (n.isVoice()) {
                        await voiceChannelUpdate()
                    }
                } catch (err) {
                    if (err.code === 429) {
                        await client.util.handleRateLimit()
                    }
                    return
                }
            })
    })
}
