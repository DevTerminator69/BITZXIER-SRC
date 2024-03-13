const {
    MessageEmbed,
    Message,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    Client
} = require('discord.js')

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    premium: true,
    run: async (client, message, args) => {
        let prefix = message.guild?.prefix
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('helpop')
                .setPlaceholder(`❯ ${client.user.username} Help Menu!`)
                .addOptions([
                    {
                        label: ' AntiNuke',
                        description: 'Get All AntiNuke Command List',
                        value: 'first',
                        emoji: '<:bitzxier_antinuke:1181289584483643433>'
                    },
                    {
                        label: ' Moderation',
                        description: 'Get All Moderation Command List',
                        value: 'second',
                        emoji: '<:bitzxier_moderator:1181290384576491561>'
                    },
                    {
                        label: 'Utility',
                        description: 'Get All Utility Command List',
                        value: 'third',
                        emoji: '<:bitzxier_utility:1181291761667149886>'
                    },
                    {
                        label: 'Welcomer',
                        description: 'Get All Welcomer Command List',
                        value: 'fourth',
                        emoji: '<:bitzxier_autorole:1181290290238210158>'
                    },
                    {
                        label: 'Voice',
                        description: 'Get All Voice Command List',
                        value: 'fifth',
                        emoji: '<:bitzxier_mic:1181294198046072994>'
                    }
                ])
        )
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(
                `<:bitzxier_dot_1:1181287240870146139> Prefix for this server \`${prefix}\`\n<:bitzxier_dot_1:1181287240870146139>  Total Commands: \`${client.commands.size}\`**\n[Invite Me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) | [Support Server](https://discord.gg/5p6z8kh8sP)**\nType \`${prefix}antinuke enable\` to get started up!`
            )
            .addField(
                'Command Category',
                `**<:bitzxier_antinuke:1181289584483643433> \`:\` AntiNuke\n<:bitzxier_moderator:1181290384576491561>  \`:\` Moderation\n<:bitzxier_utility:1181291761667149886> \`:\` Utility\n<:bitzxier_autorole:1181290290238210158> \`:\` Welcomer\n<:bitzxier_mic:1181294198046072994> \`:\` Voice**\n\n\`Choose A Category To Get All Commands List\``
            )
        message.channel.send({ embeds: [embed], components: [row] })
    }
}
