const { MessageEmbed } = require('discord.js')

module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || message.author.system || !message.guild)
            return
            let check =  await client.util.BlacklistCheck(message.guild)
            if(check) return  
        client.util.manageAfk(message, client)
    })
}
