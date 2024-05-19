const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)
module.exports = {
    name: 'blacklist',
    aliases: ['bl'],
    category: 'owner',
    run: async (client, message, args) => {
        if (!this.config.admin.includes(message.author.id)) return
        const embed = new MessageEmbed().setColor(client.color)
        let prefix = message.guild.prefix
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklist \`<add/remove/list>\` \`<user id>\``
                        )
                ]
            })
        }
        if (args[0].toLowerCase() === `list`) {
            let listing = (await client.db.get(`blacklist_${client.user.id}`))
                ? await client.db.get(`blacklist_${client.user.id}`)
                : []
            let info = []
            let ss
            if (listing.length < 1) info.push(`No Users ;-;`)
            else {
                for (let i = 0; i < listing.length; i++) {
                    ss = await client.users.fetch(`${listing[i]}`)
                    info.push(`${i + 1}) ${ss.tag} (${ss.id})`)
                }
            }
            return await client.util.pagination(
                message,
                info,
                '**Blacklist Users List** :-'
            )
        }
        let check = 0
        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklist \`<add/remove/list>\` \`<user id>\``
                        )
                ]
            })
        }
        let user = await client.users.fetch(`${args[1]}`).catch((er) => {
            check += 1
        })
        if (check == 1) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklist \`<add/remove/list>\` \`<user id>\``
                        )
                ]
            })
        }
        let added = (await client.db.get(`blacklist_${client.user.id}`))
            ? await client.db.get(`blacklist_${client.user.id}`)
            : []

        let opt = args[0].toLowerCase()
        if (opt == `add` || opt == `a` || opt == `+`) {
            added.push(`${user.id}`)
            added = client.util.removeDuplicates2(added)
            await client.db.set(`blacklist_${client.user.id}`, added)
            client.util.blacklist()
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | **<@${user.id}> (${user.id})** has been added as a **Blacklist** user.`
                        )
                ]
            })
        }
        if (opt == `remove` || opt == `r` || opt == `-`) {
            added = added.filter((srv) => srv != `${user.id}`)
            added = client.util.removeDuplicates2(added)
            await client.db.set(`blacklist_${client.user.id}`, added)
            client.util.blacklist()
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | **<@${user.id}> (${user.id})** has been removed from a **Blacklist** user.`
                        )
                ]
            })
        }
        message.channel.send({
            embeds: [
                embed
                    .setColor(client.color)
                    .setDescription(
                        `${prefix}blacklist \`<add/remove/list>\` \`<user id>\``
                    )
            ]
        })
    }
}
