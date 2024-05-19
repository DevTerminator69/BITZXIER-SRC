module.exports = async (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        await client.util.BlacklistCheck(oldState.guild.id)
        let guild = oldState.guild
        let data = await client.db.get(`vcroles_${guild.id}`)
        if (!data) return
        let role = await guild.roles.cache.get(data.vcrole)
        if (!role) {
            await client.db.set(`vcroles_${guild.id}`, {
                vcrole: null,
                vcrolebot: data ? data.vcrolebot : null
            })
            return
        }
        if (
            role &&
            !role.permissions.has([
                'ADMINISTRATOR',
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'MANAGE_CHANNELS',
                'MANAGE_GUILD',
                'MENTION_EVERYONE',
                'MANAGE_ROLES',
                'MANAGE_WEBHOOKS'
            ])
        ) {
            if (!oldState.channel && newState.channel) {
                await client.util.sleep(1000)
                if (!newState.member.user.bot) {
                    await newState.member.roles
                        .add(role, 'Member Joined Vc | Satxler Humans VC Role')
                        .catch((err) => null)
                }
            } else if (oldState.channel && !newState.channel) {
                await client.util.sleep(1000)
                if (!newState.member.user.bot) {
                    await oldState.member.roles
                        .remove(
                            role,
                            'Member Left Vc | Satxler Humans VC Role'
                        )
                        .catch((err) => null)
                }
            }
        }
    })

    client.on('voiceStateUpdate', async (oldState, newState) => {
        await client.util.BlacklistCheck(oldState.guild.id)
        let guild = oldState.guild
        let data = await client.db.get(`vcroles_${guild.id}`)
        if (!data) return
        let role = await guild.roles.cache.get(data.vcrolebot)
        if (!role) {
            await client.db.set(`vcroles_${guild.id}`, {
                vcrole: data ? data.vcrole : null,
                vcrolebot: null
            })
            return
        }
        try {
            if (
                role &&
                !role.permissions.has([
                    'ADMINISTRATOR',
                    'KICK_MEMBERS',
                    'BAN_MEMBERS',
                    'MANAGE_CHANNELS',
                    'MANAGE_GUILD',
                    'MENTION_EVERYONE',
                    'MANAGE_ROLES',
                    'MANAGE_WEBHOOKS'
                ])
            ) {
                if (!oldState.channel && newState.channel) {
                    await client.util.sleep(1000)
                    if (newState.member.user.bot) {
                        await newState.member.roles
                            .add(role, 'Bot Joined Vc | Satxler Bot Vc Role')
                            .catch((err) => null)
                    }
                } else if (oldState.channel && !newState.channel) {
                    await client.util.sleep(1000)
                    if (oldState.member.user.bot) {
                        await oldState.member.roles
                            .remove(role, 'Bot Left Vc | Satxler Bot Vc Role')
                            .catch((err) => null)
                    }
                }
            }
        } catch (err) {
            if (err.code === 429) {
                await client.util.handleRateLimit()
            }
            return
        }
    })
}
