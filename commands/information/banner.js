const { Message, Client, MessageEmbed } = require('discord.js')
const axios = require('axios')

module.exports = {
    name: 'banner',
    category: 'info',
    premium: true,

    run: async (client, message, args) => {
        let user =
            (await message.mentions.members.first()) ||
            (await client.users.fetch(args[0])) ||
            (await message.member)

        const data = await axios
            .get(`https://discord.com/api/users/${user.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`
                }
            })
            .then((d) => d.data)
        if (data.banner) {
            let url = data.banner.startsWith('a_')
                ? '.gif?size=4096'
                : '.png?size=4096'
            url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${url}`
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`Banner Of ${user}`)
                        .setFooter(`Requested By: ${message.author.tag}`)
                        .setImage(url)
                ]
            })
        } else {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`You Don't Have A Banner`)
                ]
            })
        }
    }
}
