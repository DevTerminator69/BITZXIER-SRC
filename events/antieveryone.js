module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        const loda = message.mentions.everyone
        if (!loda) return
        if (loda === true) {
            await client.db?.get(`${message.guild.id}_${message.author.id}_wl`).then(async (data) => {
                const antinuke = await client.db.get(`${message.guild.id}_antinuke`);
                if (antinuke !== true) return;
                if(data){
            if(data.meneve) return;
                }
                if (message?.author?.id === message.guild.ownerId) return
                if (message?.author?.id === client.user.id) return
                if (message.webhookId) return message.delete().catch((_) => {})
                try {
                    message.author.guild = message.guild
                    await client.util.FuckYou(
                        message.author,
                        'Mentioned Everyone/Here | Not Whitelisted'
                    )
                    await message.delete().catch((_) => {})
                    await message.channel.permissionOverwrites.edit(
                        message.guild.roles.everyone,
                        {
                            VIEW_CHANNEL: false
                        }
                    )
                } catch (err) {
                    return
                }
            })
        }
    })
}
