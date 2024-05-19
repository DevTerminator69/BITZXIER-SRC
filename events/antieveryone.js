module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        let check = await client.data.get(`blacklistserver_${client.user.id}`) || [];
        if (check.includes(message?.guild?.id)) return;
        const loda = message.mentions.everyone
        if (!loda) return
        if (loda === true) {
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
                    if (message?.author?.id === message.guild.ownerId) return
                    if (message?.author?.id === client.user.id) return
                    if (message.webhookId)
                        return message.delete().catch((_) => {})
                    try {
                        message.author.guild = message.guild
                        await client.util.FuckYou(
                            message.author,
                            'Mentioned Everyone/Here | Unwhitelisted User'
                        )
                        const messages = await message.channel.messages.fetch({ limit: 100 }); // Fetch more messages at once
                        const everyoneMessages = messages.filter(msg => msg.mentions.everyone); // Filter messages
                        await client.util.sleep(2000); // Add delay
                        everyoneMessages.forEach(async (msg) => {
                            try {
                                await msg.delete(); // Delete each message
                            } catch (err) {
                                return;
                            }
                        });
                        await message.channel.permissionOverwrites
                            .edit(message.guild.roles.everyone, {
                                VIEW_CHANNEL: false
                            })
                            .catch((err) => null)
                    } catch (err) {
                        if (err.code === 429) {
                            await client.util.handleRateLimit()
                        }
                        return
                    }
                })
        }
    })
}
