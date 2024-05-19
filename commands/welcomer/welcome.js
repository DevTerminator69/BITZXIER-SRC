const { MessageEmbed } = require('discord.js')
const { getSettingsar } = require('../../models/autorole')

module.exports = {
    name: 'welcome',
    aliases: ['setwelcome'],
    category: 'welcomer',
    run: async (client, message, args) => {
        if (message.guild.memberCount < 30) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Your Server Doesn't Meet My 30 Member Criteria`
                        )
                ]
            })
        }
        const settings = await getSettingsar(message.guild)
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You must have \`Administration\` perms to run this command.`
                        )
                ]
            })
        }
        let isown = message.author.id == message.guild.ownerId
        if (!isown && !client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }
        let status = args[0]?.toUpperCase()
        if (!status) {
            let embed = new MessageEmbed()
                .setColor(client.color)
                .addFields([
                    {
                        name: `\`welcome <on | off>\``,
                        value: `Toggles the welcomer system for this server.`
                    },
                    {
                        name: `\`welcomechannel\` <#welcome>`,
                        value: `Toggles the channel where welcome message will be send.`
                    },
                    {
                        name: `\`welcomemessage\` <autodel | color | description | thumbnail | title>`,
                        value: `Sets the embed values according to your choice`
                    },
                    {
                        name: `\`welcometest\``,
                        value: `Test the welcome message how it will look like.`
                    },
                    {
                        name: `\`welcomereset\``,
                        value: `reset the welcomer module configuration.`
                    }
                ])
                .setTitle(`Welcome Commands`)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
            return message.channel.send({ embeds: [embed] })
        }
        if (!['ON', 'OFF'].includes(status)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You didn't provide a valid status of welcome.\nStatus: \`on\`, \`off\``
                        )
                ]
            })
        }
        let response = await client.util.setStatus(settings, status)
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(response)
            ]
        })
    }
}
