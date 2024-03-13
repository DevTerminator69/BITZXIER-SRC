const { MessageEmbed } = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)
module.exports = {
    name: `serverslist`,
    category: `Owner`,
    aliases: [`slist`],
    description: `Shows servers list`,
    usage: `servers-list`,
    run: async (client, message, args) => {
        if (!this.config.admin.includes(message.author.id)) return
        let servers = []
        client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((r) => r)
            .forEach((element) => {
                servers.push(element)
            })
        let serverslist = []
        for (let i = 0; i < servers.length; i++) {
            let name = servers[i].name,
                id = servers[i].id
            serverslist.push(`${i + 1}) ${name} (${id})`)
        }
        return await client.util.pagination(
            message,
            serverslist,
            `**Server List Of ${client.user.username}**`
        )
    }
}
