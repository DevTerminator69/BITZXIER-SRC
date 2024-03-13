const { MessageEmbed } = require('discord.js')

module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || message.author.system || !message.guild)
            return
         client.util.manageAfk(message, client)
    })
}
