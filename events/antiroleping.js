const { getSettings } = require('../models/mainrole')
const { Guild } = require('discord.js')
module.exports = async (client) => {
    /*
     * @param {Message} message
     * @param {Guild} guild
     * @returns {Promise<void>}
     * */
    client.on('messageCreate', async (message) => {
        let check = await client.data.get(`blacklistserver_${client.user.id}`) || [];
        if (check.includes(message?.guild?.id)) return;
        const settings = await getSettings(message.guild)
        if (!settings) return
        if (!settings.mainrole) return

        const checkExist = settings.mainrole.filter((_role) =>
            message.mentions.roles.map((r) => r.id).includes(_role)
        )
        if (checkExist.length > 0) {
            await client.db
                ?.get(`${message.guild.id}_${message.author.id}_wl`)
                .then(async (data) => {
                    const antinuke = await client.db.get(
                        `${message.guild.id}_antinuke`
                    )
                    if (antinuke !== true) return
                    if (data) {
                        if (data.meneve) return
                    }
                    if (message.author.id === message.guild.ownerId) return
                    if (message.author.id === client.user.id) return
                    if (message.webhookId) message.delete().catch((_) => {})
                    message.author.guild = message.guild
                    if (!message.channel) return

                    try {
                        await client.util
                            .FuckYou(
                                message.author,
                                'Mentioned Mainrole | Unwhitelisted User'
                            )
                            .catch((err) => null)
                        await message.channel.permissionOverwrites
                            .edit(message.guild.roles.everyone, {
                                VIEW_CHANNEL: false
                            })
                            .catch((_) => {})
                        await message.delete().catch((err) => null)
                    } catch (err) {
                        if (err.code === 429) {
                            await client.util.handleRateLimit()
                        }
                        return
                    }
                })
        } else {
            return
        }
    })
}
