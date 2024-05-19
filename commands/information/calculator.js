const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const simplydjs = require('simply-djs')

module.exports = {
    name: 'calculator',
    category: 'info',
    aliases: ['calc'],
    usage: '!calculator or !calc',
    run: async (client, message, args) => {
        simplydjs.calculator(message, {
            embedColor: client.color,
            credit: false
        })
    }
}
