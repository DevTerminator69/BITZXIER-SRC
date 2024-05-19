const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js')

module.exports = {
    name: 'nuke',
    category: 'mod',
    premium: true,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            let error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Manage Channels\` permission to use this command.`
                )
            return message.channel.send({ embeds: [error] })
        }
        if (client.util.hasHigher(message.member) == false) {
            let error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `Your highest role must be higher than my highest role to use this command.`
                )
            return message.channel.send({ embeds: [error] })
        }
        try {
            let row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('YES')
                    .setStyle('SUCCESS')
                    .setLabel('Yes'),
                new MessageButton()
                    .setCustomId('NO')
                    .setStyle('DANGER')
                    .setLabel('No')
            )
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `Are you sure that you want to nuke this channel.`
                )
            let msg = await message.channel.send({
                embeds: [embed],
                components: [row]
            })
            const filter = (interaction) => {
                if (interaction.user.id === message.author.id) return true
                return interaction.reply({
                    content: `Only ${message.author.username} Can Use These Buttons`,
                    ephemeral: true
                })
            }
            const collector = message.channel.createMessageComponentCollector({
                filter,
                max: 1
            })

            collector.on('collect', (buttonInteraction) => {
                const id = buttonInteraction.customId
                if (id === 'YES') {
                    message.channel.clone().then((ch) => {
                        let reason = args.join(' ') || 'No Reason'
                        let embed = new MessageEmbed()
                            .setTitle('**Channel Succesfuly Nuked**')
                            .setColor(client.color)
                        ch.setParent(message.channel.parent)
                        ch.setPosition(message.channel.position)
                        message.channel.delete().then(() => {
                            ch.send({ embeds: [embed] }).then((msg) => {
                                setTimeout(() => msg.delete(), 5000)
                            })
                        })
                    })
                }
                if (id === 'NO') {
                    msg.delete().catch((e) => {})
                }
            })
        } catch (err) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`I was unable to nuke this channel.`)
                ]
            })
        }
    }
}
