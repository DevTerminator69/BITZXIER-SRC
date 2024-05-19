const { SnowflakeUtil, MessageEmbed, WebhookClient } = require('discord.js')
const { isMaster } = require('cluster')

const memoryLogger = new WebhookClient({
    url: 'https://discord.com/api/webhooks/1217308163016233103/P75IMICLgYQYcSL4bYHaBggcyZrBZqimz39r5RLRPpVJwAShA2bg0dNaun1uoLCpdpU3'
})

const THRESHOLD = 60
module.exports = class MemorySweeper {
    constructor(client) {
        this.client = client
        this.task = null
    }

    get id() {
        return isMaster ? 'Parent' : process.env.CLUSTER_ID
    }

    setup() {
        if (this.task) clearInterval(this.task)

        this.run()
        this.task = setInterval(() => this.run(), {
            playerDeployer: 60,
            checkQueueDelay: 60,
            memorySweeper: 60
        })
        this.task = setInterval(() => this.run(), 60 * 1000) // 60 seconds interval
    }
    run() {
        const OLD_SNOWFLAKE = SnowflakeUtil.generate(Date.now() - THRESHOLD)
        let guildMembers = 0,
            lastMessages = 0,
            emojis = 0,
            voiceStates = 0,
            users = 0

        let oldMemoryUsage = process.memoryUsage().heapUsed

        // Per-Guild sweeper
        for (const guild of this.client.guilds.cache.values()) {
            if (!guild.available) continue

            // Clear members that haven't send a message in the last 30 minutes
            for (const [id, member] of guild.members.cache) {
                if (member.id === this.client.user.id) continue

                if (member.voice.channelID && member.user.bot)
                    guild.voiceStates.cache.delete(id)
                if (
                    member.lastMessageID &&
                    member.lastMessageID > OLD_SNOWFLAKE
                )
                    guild.members.cache.delete(id)

                guildMembers++
                voiceStates++
            }

            // Clear emojis
            if (guild.id !== '1180427110200905798') {
                // don't clear support guild's emojis.
                emojis += guild.emojis.cache.size
                guild.emojis.cache.clear()
            }
        }

        // Per-Channel sweeper
        for (const channel of this.client.channels.cache.values()) {
            if (!channel.lastMessageID) continue
            channel.lastMessageID = null
            lastMessages++
        }

        // Per-User sweeper
        for (const user of this.client.users.cache.values()) {
            if (user.lastMessageID && user.lastMessageID > OLD_SNOWFLAKE)
                continue
            this.client.users.cache.delete(user.id)
            //      this.client.settings.users.cache.delete(user.id);
            users++
        }

        if (this.client.user.tag !== 'Satxler#7940') return

        const embed = new MessageEmbed()
            .setTitle(`Cluster #${this.id} | Memory Sweeper`)
            .setColor(this.client.color)
            .setDescription(
                `**Cache sweeped:**\n` +
                    `Guild Members: \`${guildMembers}\`\n` +
                    `Users: \`${users}\`\n` +
                    `Emojis: \`${emojis}\`\n` +
                    `Voice States: \`${voiceStates}\`\n` +
                    `Messages: \`${lastMessages}\``
            )
            .addFields(
                {
                    name: 'Memory Sweeped:',
                    value: `\`${client.util.formatBytes(process.memoryUsage().heapUsed - oldMemoryUsage)}\``,
                    inline: true
                },
                {
                    name: 'Memory Usage:',
                    value: `\`${client.util.formatBytes(process.memoryUsage().heapUsed)}\``,
                    inline: true
                }
            )

        memoryLogger.send({ embeds: [embed] }).catch(() => null)
    }

    /**
     * Set a colour depending on the amount:
     * > 1000 : Light Red colour
     * > 100  : Light Yellow colour
     * < 100  : Green colour
     * @since 3.0.0
     * @param {number} number The number to colourise
     * @returns {string}
     */
    setColor(number) {
        const text = String(number).padStart(5, ' ')
        // Light Red color
        if (number > 1000) return `\x1b[31m${text}\x1b[0m`
        // Light Yellow color
        if (number > 100) return `\x1b[33m${text}\x1b[0m`
        // Green color
        return `\x1b[32m${text}\x1b[0m`
    }
}
