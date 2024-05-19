module.exports = async (client) => {
    /* On guild join */
    client.on('guildCreate', async (guild) => {
        let data = await client.db.set(`blacklistserver_${client.user.id}`)
        if(data.includes(guild.id)) {
            await client.util.sleep(2000)
            await guild.leave()
        }
        
        await client.db.set(`${guild.id}_wl`, {
            whitelisted: []
        })
        await client.db.set(`${guild.id}_antinuke`, false)
        let prefix = await client.db.get(`prefix_${guild.id}`)
        if(prefix === null) {
         await client.db.set(`prefix_${guild.id}`,`&`)
        }
    
        })

    /* On guild leave */
    client.on('guildDelete', async (guild) => {
        await client.db.get(`${guild.id}_wl`).then(async (data2) => {
            const users = data2.whitelisted ?? null
            let i
            for (i = 0; i < users.length; i++) {
                let data2 = await client.db?.get(`${guild.id}_${users[i]}_wl`)
                if (data2) {
                    await client.db?.delete(`${guild.id}_${users[i]}_wl`)
                }
            }
        })
        await client.db.set(`${guild.id}_wl`, null)
        await client.db.set(`${guild.id}_antinuke`, false)
    })
}
