const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)
module.exports = {
    name: 'blacklistserver',
    aliases: ['bs'],
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
                            `Please provide the required arguments.\n${prefix}blacklistserver \`<add/remove/list>\` \`<server id>\``
                        )
                ]
            })
        }
        if (args[0].toLowerCase() === `list`) {
            let listing = (await client.data.get(`blacklistserver_${client.user.id}`))
                ? await client.data.get(`blacklistserver_${client.user.id}`)
                : []
            let info = []
            let ss
            if (listing.length < 1) info.push(`No servers ;-;`)
            else {
                for (let i = 0; i < listing.length; i++) {
                    ss = await client.guilds.fetch(listing[i]).catch(() => null); // Fetch guild
                    if (ss) {
                        info.push(`${i + 1}) ${ss.name} (${ss.id})`);
                    } else {
                        // If guild is not available, remove it from the blacklist
                        await client.data.set(`blacklistserver_${client.user.id}`, listing.filter(id => id !== listing[i]));
                    }
                }
            }
            return await client.util.pagination(
                message,
                info,
                '**Blacklist Server List** :-'
            )
        }
        let check = 0
        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklistserver \`<add/remove/list>\` \`<server id>\``
                        )
                ]
            })
        }
        let user = await client.guilds.fetch(`${args[1]}`).catch((er) => {
            check += 1
        })
        if (check == 1 || !user) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide a valid server ID.\n${prefix}blacklistserver \`<add/remove/list>\` \`<server id>\``
                        )
                ]
            })
        }
        let added = (await client.data.get(`blacklistserver_${client.user.id}`))
            ? await client.data.get(`blacklistserver_${client.user.id}`)
            : []

        let opt = args[0].toLowerCase()
        if (opt == `add` || opt == `a` || opt == `+`) {
            added.push(`${user.id}`)
            added = client.util.removeDuplicates2(added)
            await client.data.set(`blacklistserver_${client.user.id}`, added)
            client.util.blacklistserver()
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | **${user.name} (${user.id})** has been added as a **Blacklist** server.`
                        )
                ]
            })
        }
        if (opt == `remove` || opt == `r` || opt == `-`) {
            added = added.filter((srv) => srv != `${user.id}`)
            added = client.util.removeDuplicates2(added)
            await client.data.set(`blacklistserver_${client.user.id}`, added)
            client.util.blacklistserver()
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.tick} | **${user.name} (${user.id})** has been removed from a **Blacklist** Server.`
                        )
                ]
            })
        }
        message.channel.send({
            embeds: [
                embed
                    .setColor(client.color)
                    .setDescription(
                        `${prefix}blacklistserver \`<add/remove/list>\` \`<user id>\``
                    )
            ]
        })
    }
}
