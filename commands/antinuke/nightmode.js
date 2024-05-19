const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const mongoose = require('mongoose')
const wait = require('wait')
const ricky = ['259176352748404736', '1212431696381612132']

this.config = require(`${process.cwd()}/config.json`)

mongoose.connect(this.config.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const RolePermissionSchema = new mongoose.Schema({
    guildId: String,
    roleId: String,
    adminPermissions: BigInt
})
const rolePermissionSchema = mongoose.model('Nightmode', RolePermissionSchema)
module.exports = {
    name: 'nightmode',
    aliases: [],
    cooldown: 10,
    category: 'security',
    premium: true,
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
        let own = message.author.id == message.guild.ownerId
        const check = await client.util.isExtraOwner(
            message.author,
            message.guild
        )
        if (!own && !check && !ricky.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Only Server Owner Or Extraowner Can Run This Command.!`
                        )
                ]
            })
        }

        if (
            !own &&
            !(
                message?.guild.members.cache.get(client.user.id).roles.highest
                    .position <= message?.member?.roles?.highest.position
            ) &&
            !ricky.includes(message.author.id)
        ) {
            const higherole = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `${client.emoji.cross} | Only Server Owner Or Extraowner Having Higher Role Than Me Can Run This Command`
                )
            return message.channel.send({ embeds: [higherole] })
        }
        let prefix = '&' || message.guild.prefix
        const option = args[0]

        const nightmode = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Nightmode**__`)
            .setDescription(
                `Enhance your server's security with the Nightmode feature! This powerful tool swiftly manages roles, ensuring your community stays secure and protected. Nightmode enables you to quickly disable dangerous permissions for manageable roles, such as removing the powerful \`ADMINISTRATOR\` rights. Additionally, it stores original permissions, allowing for seamless restoration when needed.`
            )
            .addFields([
                {
                    name: `__**Nightmode Enable**__`,
                    value: `To enable Nightmode - \`${prefix}nightmode enable\``
                },
                {
                    name: `__**Nightmode Disable**__`,
                    value: `To disable Nightmode - \`${prefix}nightmode disable\``
                }
            ])

        if (!option) {
            return message.channel.send({ embeds: [nightmode] })
        }

        if (option === 'enable') {
            const botHighestRole = message.guild.me.roles.highest
            const manageableRoles = message.guild.roles.cache.filter(
                (role) =>
                    role.comparePositionTo(botHighestRole) < 30 &&
                    role.name !== '@everyone' &&
                    role.permissions.has('ADMINISTRATOR')
            )

            if (manageableRoles.size === 0) {
                return message.channel.send(
                    'No Roles Found With Admin Permissions'
                )
            }

            const promises = manageableRoles.map(async (role) => {
                const adminPermissions = role.permissions
                    .toArray()
                    .filter((p) => p.startsWith('ADMINISTRATOR'))

                const permissionsBitfield = new Discord.Permissions(
                    adminPermissions
                ).bitfield

                if (adminPermissions.length > 0) {
                    let permissions = await role.permissions.toArray()
                    permissions = await permissions.filter(
                        (permission) => permission !== 'ADMINISTRATOR'
                    )
                    await client.util.sleep(3000)
                    await role
                        .setPermissions(
                            permissions,
                            `Satxler NIGHTMODE ENABLED`
                        )

                        .catch((err) => {
                            message.channel.send(
                                `Please Check My Role Position And Give Me Proper Role.`
                            )
                            return
                        })
                }
                const serverData = await rolePermissionSchema.findOne({
                    guildId: message.guild.id,
                    roleId: role.id
                })
                if (serverData) {
                    await client.util.sleep(3000)
                    await rolePermissionSchema
                        .findOneAndUpdate(
                            { guildId: message.guild.id, roleId: role.id },
                            { adminPermissions: permissionsBitfield },
                            { upsert: true }
                        )
                        .catch((err) => null)
                } else {
                    await client.util.sleep(3000)
                    await rolePermissionSchema
                        .create({
                            guildId: message.guild.id,
                            roleId: role.id,
                            adminPermissions: permissionsBitfield
                        })
                        .catch((err) => null)
                }
            })
            await client.util.sleep(3000)
            await Promise.all(promises)

            message.channel.send(
                'Nightmode enabled! Dangerous Permissions Disabled For Manageable Roles.'
            )
        } else if (option === 'disable') {
            const storedRoles = await rolePermissionSchema.find({
                guildId: message.guild.id
            })

            const promises = storedRoles.map(async (storedRole) => {
                const role = message.guild.roles.cache.get(storedRole.roleId)
                if (role) {
                    try {
                        await client.util.sleep(3000)
                        await role.setPermissions(
                            storedRole.adminPermissions,
                            `Satxler NIGHTMODE DISABLED`
                        )
                    } catch (err) {
                        return
                    }
                }

                await client.util.sleep(3000)
                await rolePermissionSchema
                    .findOneAndDelete({
                        guildId: message.guild.id,
                        roleId: storedRole.roleId
                    })
                    .catch((err) => {
                        return message.channel.send(
                            `Removing Stored Role From The Database.`
                        )
                    })
            })

            await client.util.sleep(3000)
            await Promise.all(promises)
            await message.channel.send(
                'Nightmode disabled! Restored Permissions For Manageable Roles.'
            )
        } else {
            return message.channel.send({ embeds: [nightmode] })
        }
    }
}
