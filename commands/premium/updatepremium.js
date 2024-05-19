const { Discord } = require('discord.js')
const { MessageEmbed } = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)

module.exports = {
    name: 'updatepremium',
    aliases: ['updateprem', 'upremium'],
    run: async (client, message, args) => {
        const em1 = new MessageEmbed()
        let time
        let count
        if (!this.config.owner.includes(message.author.id)) return
        const embed = new MessageEmbed().setColor('#0x2b2d31')
        if (args[0]) {
            try {
                await client.users.fetch(args[0])
            } catch (error) {
                return message.channel.send('Invalid Id')
            }
            if (args[1]) {
                time = Date.now() + 86400000 * args[1]
            } else if (!args[1]) {
                time = await client.db.get(`upremend_${args[0]}`)
            }
            if (args[2]) {
                count = args[2]
            }
            if (!args[2]) {
                count = (await client.db.get(`upremcount_${args[0]}`))
                    ? await client.db.get(`upremcount_${args[0]}`)
                    : 0
            }
            await client.db.set(`uprem_${args[0]}`, `true`)
            await client.db.set(`upremend_${args[0]}`, time)
            await client.db.set(`upremcount_${args[0]}`, count)
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        `<@${
                            args[0]
                        }>'s Premium Has Been Updated\nPremium Count - \`${count}\`    Premium Expiring - <t:${Math.round(
                            time / 1000
                        )}>`
                    )
                ]
            })
        } else
            return message.channel.send({
                embeds: [embed.setDescription(`Please Give The User Id`)]
            })
    }
}
/*
Math.round((Date.now() + 86400000 * 1) / 1000)
*/
