const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'roleinfo',
    aliases: ['ri'],
    category: 'info',
    description: 'To Get Information About A Role',
    run: async (client, message, args) => {
        let role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[0])
        if (!role) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You didn't provided a valid role.`
                        )
                ]
            })
        }
        let color = role.color == 0 ? '#000000' : role.color
        let created = `<t:${Math.round(role.createdTimestamp / 1000)}:R>`
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${role.name}'s Information`,
                iconURL: client.user.displayAvatarURL()
            })
            .addFields([
                {
                    name: `General Info`,
                    value: `Role Name: **${role.name}**\nRole Id: \`${role.id}\`\nRole Position: **${role.rawPosition}**\nHex Code: \`${color}\`\nCreated At: ${created}\nMentionability: ${role.mentionable}\nIntegration: ${role.managed}`
                },
                {
                    name: `Allowed Permissions`,
                    value: `${
                        role.permissions.toArray().includes('ADMINISTRATOR')
                            ? '`ADMINISTRATOR`'
                            : role.permissions
                                  .toArray()
                                  .sort((a, b) => a.localeCompare(b))
                                  .map((p) => `\`${p}\``)
                                  .join(', ')
                    }`
                }
            ])
            .setColor(color == '#000000' ? '000001' : client.color)
        message.channel.send({ embeds: [embed] })
    }
}
