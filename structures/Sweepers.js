const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
 const { SnowflakeUtil, WebhookClient } = require("discord.js");
const { isMaster } = require('cluster');
const memoryLogger = new WebhookClient({ url: 'https://discord.com/api/webhooks/1198206014860836934/X997VwN3ESSyERfanZZZMdRm8FBKdfK-MBYIc5HE3gcvheEv_Xq4aLjCgjtWNq2MLuiW' })
const THRESHOLD = 1000 * 60 * 60;
module.exports = class Sweeper {
    constructor(client) {
        this.client = client
    }

  get id() {
    return isMaster ? 'Parent' : process.env.CLUSTER_ID; 
  }

  setup() {
    if (this.task) clearInterval(this.task);
    this.task = setInterval(() => this.run(), 1000*60*60);
  }

  run() {
    const OLD_SNOWFLAKE = SnowflakeUtil.generate(Date.now() - THRESHOLD);
    let guildMembers = 0, lastMessages = 0, emojis = 0, voiceStates = 0;

    let oldMemoryUsage = process.memoryUsage().heapUsed;

    for (const guild of this.client.guilds.cache.values()) {
      if (!guild.available) continue;

      for (const [id, member] of guild.members.cache) {
        if (member.id === this.client.user.id) continue;

        if (member.voice.channelId && member.user.bot) guild.voiceStates.cache.delete(id);
        if (member.lastMessageId && member.lastMessageId > OLD_SNOWFLAKE) guild.members.cache.delete(id);
        guildMembers++;
        voiceStates++;
      }

        emojis += guild.emojis.cache.size;
        guild.emojis.cache.clear();
    }
    this.client.guilds.cache.sweep(guild => !guild.available);
    this.client.msg.clear();
    for (const channel of this.client.channels.cache.values()) {
      if (!channel.lastMessageId) continue;
      channel.lastMessageId = null;
      lastMessages++;
    }
   
    const embed = new MessageEmbed()
      .setTitle(`Cluster #${this.id} | Memory Sweeper`)
      .setColor(this.client.color)
      .setDescription(
        `**Cache sweeped:**\n` +
        `Guild Members: \`${guildMembers}\`\n` +
        `Emojis: \`${emojis}\`\n` +
        `Voice States: \`${voiceStates}\`\n` +
        `Messages: \`${lastMessages}\``
      )
      .addFields({ name: "Memory Sweeped:", value: `\`${parseFloat((process.memoryUsage().heapUsed - oldMemoryUsage) / 1024 / 1024).toFixed(2)} MB\``, inline: true },
                { name: "Memory Usage:", value: `\`${parseFloat((process.memoryUsage().heapUsed) / 1024 / 1024).toFixed(2)} MB\``, inline: true }); //dekh
    memoryLogger.send({embeds: [embed]}).catch(() => null);
  }

  setColor(number) {
    const text = String(number).padStart(5, " ");
    // Light Red color
    if (number > 1000) return `\x1b[31m${text}\x1b[0m`;
    // Light Yellow color
    if (number > 100) return `\x1b[33m${text}\x1b[0m`;
    // Green color
    return `\x1b[32m${text}\x1b[0m`;
  }
}
