const { Discord } = require('discord.js')
const { MessageEmbed } = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)
module.exports = {
    name: 'addpremium',
    aliases: ['addprem', 'premium+'],
    category: 'Owner',
    run: async (client, message, args) => {
        const em1 = new MessageEmbed()
        let time
        let count
        if (!this.config.owner.includes(message.author.id)) return
        let arr = []
        const embed = new MessageEmbed().setColor(client.color)
        if (args[0]) {
            try {
                await client.users.fetch(args[0])
            } catch (error) {
                return message.channel.send('Invalid Id')
            }
            if (args[1]) {
                time = Date.now() + 86400000 * args[1]
            } else if (!args[1]) {
                time = Date.now() + 86400000 * 1
            }
            if (args[2]) {
                count = args[2]
            }
            if (!args[2]) {
                count = 0
            }
            client.db.set(`uprem_${args[0]}`, `true`)
            client.db.set(`upremend_${args[0]}`, time)
            client.db.set(`upremcount_${args[0]}`, count)
            client.db.set(`upremserver_${args[0]}`, arr)
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<@${
                                args[0]
                            }> Has Been Added As A Premium User\nPremium Count: \`${count}\`    Premium Expiring - <t:${Math.round(
                                time / 1000
                            )}>`
                        )
                ]
            })
        } else
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`Please Give The User Id`)
                ]
            })
    }
}
/*
Math.round((Date.now() + 86400000 * 1) / 1000)
*/
