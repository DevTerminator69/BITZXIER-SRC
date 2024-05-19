const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'avatar',
    aliases: ['av', 'photo'],
    category: 'info',
    premium: true,

    run: async (client, message, args) => {
        let member = await getUserFromMention(message, args[0])
        if (!member) {
            try {
                member = await client.users.fetch(args[0])
            } catch (error) {
                const embed = new MessageEmbed()
                    .setFooter(`Requested By ${message.author.tag}`)
                    .setImage(
                        message.member.displayAvatarURL({
                            dynamic: true,
                            size: 4096
                        })
                    )
                    .setDescription(
                        `[\`PNG\`](${message.member.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'png'
                        })}) | [\`JPG\`](${message.member.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'jpg'
                        })}) | [\`WEBP\`](${message.member.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'webp'
                        })})`
                    )
                    .setColor(client.color)

                return message.channel.send({ embeds: [embed] })
            }
        }
        const embed = new MessageEmbed()
            .setFooter(`Requested By ${message.author.tag}`)
            .setAuthor({ name: `${member.username}`, value: `<@${member}>` })
            .setImage(member.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setDescription(
                `[\`PNG\`](${member.displayAvatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'png'
                })}) | [\`JPG\`](${member.displayAvatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                })}) | [\`WEBP\`](${member.displayAvatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'webp'
                })})`
            )
            .setColor(client.color)

        message.channel.send({ embeds: [embed] })
    }
}

function getUserFromMention(message, mention) {
    if (!mention) return null

    const matches = mention.match(/^<@!?(\d+)>$/)
    if (!matches) return null

    const id = matches[1]
    return message.client.users.fetch(id) || message.member
}
