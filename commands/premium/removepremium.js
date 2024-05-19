const { Discord } = require('discord.js')
const { MessageEmbed } = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)

module.exports = {
    name: 'removepremium',
    aliases: ['remprem', 'premium-'],
    category: 'Owner',
    run: async (client, message, args) => {
        const em1 = new MessageEmbed()
        if (!this.config.owner.includes(message.author.id)) return
        const embed = new MessageEmbed().setColor('#0x2b2d31')
        if (args[0]) {
            try {
                await client.users.fetch(args[0])
            } catch (error) {
                return message.channel.send('Invalid Id')
            }
            const use = await client.db.get(`uprem_${args[0]}`)
            if (!use) {
                return message.channel.send({
                    embeds: [
                        embed.setDescription(
                            `<@${args[0]}> Is Not A Premium User Only!`
                        )
                    ]
                })
            }
            await client.db.delete(`uprem_${args[0]}`)
            await client.db.delete(`upremend_${args[0]}`)
            await client.db.delete(`upremcount_${args[0]}`)
            await client.db.delete(`upremserver_${args[0]}`)
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        `<@${args[0]}> Has Been Removed From A Premium User.`
                    )
                ]
            })
        } else
            return message.channel.send({
                embeds: [embed.setDescription(`Please Give The User Id`)]
            })
    }
}
