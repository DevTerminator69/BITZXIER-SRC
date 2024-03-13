const { MessageEmbed, Permissions, Util,MessageButton,MessageActionRow   } = require("discord.js");
module.exports = {
    name: 'setup',
    aliases: ['customrole'],
    category: 'owner',
    run: async (client, message, args) => {
    if (!args[0]) return message.channel.send({ embeds: [new MessageEmbed().setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() }).setFooter({ text: `Developed with ❤️ by ${client.user.username} Development` }).setColor(client.color).setDescription(`.\n\`${message.guild.prefix}setup add <name> <role>\`\nSetups a role with the provided name.\n\n\`${message.guild.prefix}setup remove <name>\`\nRemoves a role with the provided name.\n\n\`${message.guild.prefix}setup reqrole <role>\`\nSetups a requirement role.\n\n\`${message.guild.prefix}setup add girl <role>\`\nSetups a role for girls\n\n\`${message.guild.prefix}setup add guest <role>\`\nSetups a role for guests.\n\n\`${message.guild.prefix}setup add vip <role>\`\nSetups a role for vip members.\n\n\`${message.guild.prefix}setup add official <role>\`\nSetups a role for official mebers.\n\n\`${message.guild.prefix}setup list\`\nShows you the list of all custom roles.\n\n\`${message.guild.prefix}setup config\`\nShows you the configuration of custom roles.`)] })
    const input = args[0].toLowerCase();
    if (input === "add") {
      const data = await client.db?.get(`customrole_${message.guild.id}`);
      if (data) {
        if (data.names.length > 50) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription("${client.emoji.cross} | You crossed the limit **50**")] })
      }
      if (!args[1]) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | ${message.guild.prefix}setup add <name> <role>`)] })
      let id = args[1].replace(/[<@&#>]/igu, "");
      const check = message.guild.roles.cache.get(id);
      if (check) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | ${message.guild.prefix}setup add <name> <role>`)] }, message).then(m => {
        client.msg.set(message.id, {
          edit: m.id
        });
      });
      const name = args[1].toLowerCase();
      if (data)
        if (data.names.length > 0) {
          if (data.names.includes(name)) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | ${name} already **exist** in my custom role list!`)] })
        }
      if (!args[2]) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | ${message.guild.prefix}setup add ${args[1]} <role>`)] })
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(2).join(" ").toLowerCase());
      if (!role) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | Role **not** found!`)] })
      if (role.managed) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | <@&${role.id}> isn't a **server** role!`)] })
     let array = ["KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "MENTION_EVERYONE", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EVENTS", "MODERATE_MEMBERS", "MANAGE_EMOJIS_AND_STICKERS"];

      if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_EVENTS") || role.permissions.has("MODERATE_MEMBERS") || role.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) return message.channel.send({ embeds: [new MessageEmbed().setDescription(`${client.emoji.cross} | I can't **add** <@&${role.id}> in my **custom role** list because it has ${new Permissions(role.permissions.bitfield).toArray().filter(a => array.includes(a)).map(arr => `\`${arr}\``).join(", ")} permissions`).setColor(client.color)] })

      let names = [], roles = [];
      if (data) {
        if (data.roles.length > 0)
          data.roles.map(r => roles.push(r));
        if (data.names.length > 0)
          data.names.map(r => names.push(r));
      }
      roles.push(role.id)
      names.push(name)
      await client.db?.set(`customrole_${message.guild.id}`, {
        names: names,
        roles: roles,
        reqrole: null
      });
      return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.tick} | Successfully **added** <@&${role.id}> to my **custom role** list!`)] })
    } else if (input == "remove") {
      let data = await client.db?.get(`customrole_${message.guild.id}`);
      if (!data) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | There's **no** custom role **setup** yet!`)] })
      if (data)
        if (data?.names?.length < 1) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | There's **no** custom role **setup** yet!`)] })
      if (!args[1]) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${message.guild.prefix}setup add <name>`)] })
      if (!data.names.includes(args[1].toLowerCase())) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | role isn't **found** with the name **${args[1]}**`)] })
      let index = data.names.indexOf(args[1].toLowerCase())
      data.names = data.names.filter(d => d !== args[1].toLowerCase());
      data.roles = data.roles.filter(d => d !== data.roles[index]);
      await client.db?.set(`customrole_${message.guildId}`, data);
      return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.tick} | Successfully **removed** ${args[1]} from my **custom role** list!`)] })
    } else if (input == "list") {
      const data = await client.db?.get(`customrole_${message.guild.id}`);
      if (!data) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription("${client.emoji.cross} | There's **nothing** to show").setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() }).setFooter({ text: `Requested By ${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })] })
      if (data) {
        if (data.names.length < 1) return message.channel.send({ embeds: [new MessageEmbed().setDescription("<:ares_tick:1101613018359541860> | There's **nothing** to show").setColor(client.color).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() }).setFooter({ text: `Requested By ${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })] })
        let c = 0;
        let embed = new MessageEmbed().setColor(client.color).setDescription(`${data.names.map((d, index) => `[\`${++c}\`] | **${message.guild.prefix}${d}**: <@&${data.roles[index]}> | \`${data.roles[index]}\``).join("\n")}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() }).setFooter({ text: `Requested By ${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` });
        return Bitzxier(embed, client, message)
      }
    } else if (input == "reset") {
      const data = await client.db?.get(`customrole_${message.guild.id}`);
      if (!data) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | There's **no** custom role **setup** yet!`)] })
      await client.db?.delete(`customrole_${message.guild.id}`);
      return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.tick} | Successfully **resetted** custom role module!`)] })
    } else if (input == "reqrole") {
      let data = await client.db?.get(`customrole_${message.guild.id}`);
      if (!data) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | There's **no** custom role **setup** yet!`)] })
      if (data)
        if (data?.names?.length < 1) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | There's **no** custom role **setup** yet!`)] })
      if (!args[1]) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${message.guild.prefix}setup reqrole <role>`)] })

      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r?.name?.toLowerCase() == args[1].toLowerCase());
      if (!role) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | Role **not** found!`)] })
      if (role.managed) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | <@&${role.id}> isn't a **server** role!`)] })
      if (role.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | <@&${role.id}> position is either **equal** or **higher** than your highest role!`)] })
      if (role.position >= message.guild.me.roles.highest.position) return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | <@&${role.id}> position is maybe **higher** or **equal** to my highest role!`)] })
      await client.db?.set(`customrole_${message.guild.id}`, {
        roles: data.roles,
        names: data.names,
        reqrole: role.id
      });
      return message.channel.send({ embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.tick} | Successfully **setup** <@&${role.id}> as custom **reqrole**`)] })
    } else if (input == "config") {
      const data = await client.db?.get(`customrole_${message.guild.id}`);
      if (!data) return message.channel.send({ embeds: [new MessageEmbed().setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() }).setFooter({ text: `Developed with ❤️ by ${client.user.username} Development` }).setColor(client.color).setDescription(`**__Reqrole__**\n\n*Role Not set*.\n\n**__Girl__**\n\n*Role Not set*.\n\n**__Guest__**\n*Role Not set*.\n\n**__Vip__**\n\n*Role Not set*.\n\n**__Official__**\n\n*Role Not set*.`).setThumbnail(client.user.displayAvatarURL())] })
      if (data.roles.length < 1 && data.names.length < 1 && !data.reqrole)
        return message.channel.send({ embeds: [new MessageEmbed().setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() }).setFooter({ text: `Developed with ❤️ by ${client.user.username} Development` }).setColor(client.color).setDescription(`**__Reqrole__**\n*Role Not set*.\n\n**__Girl__**\n*Role Not set*.\n\n**__Guest__**\n*Role Not set*.\n\n**__Vip__**\n*Role Not set*.\n\n**__Official__**\n*Role Not set*.`).setThumbnail(client.user.displayAvatarURL())] })
      let reqrole, girl, guest, vip, official;
      const check = await message.guild.roles.fetch(data.reqrole);
      const check1 = await message.guild.roles.fetch(data.roles[data.names.indexOf(data.names.filter(n => n.toLowerCase() === "girl")[0])]);
      const check2 = await message.guild.roles.fetch(data.roles[data.names.indexOf(data.names.filter(n => n.toLowerCase() === "guest")[0])]);
      const check3 = await message.guild.roles.fetch(data.roles[data.names.indexOf(data.names.filter(n => n.toLowerCase() === "vip")[0])]);
      const check4 = await message.guild.roles.fetch(data.roles[data.names.indexOf(data.names.filter(n => n.toLowerCase() === "official")[0])]);
      if (check)
        reqrole = check;
      else
        reqrole = "*Role Not set*";
      if (check1)
        girl = check1;
      else
        girl = "*Role Not set*";
      if (check)
        guest = check2;
      else
        guest = "*Role Not set*";
      if (check)
        vip = check3;
      else
        vip = "*Role Not set*";
      if (check)
        official = check4;
      else
        official = "*Role Not set*";

      let description = `**__Reqrole__**\n${reqrole?.id ? `<@&${reqrole.id}>` : "*Role Not set*"}.\n\n**__Girl__**\n${girl?.id ? `<@&${girl.id}>` : "*Role Not set*"}.\n\n**__Guest__**\n${guest?.id ? `<@&${guest.id}>` : "*Role Not set*"}.\n\n**__Vip__**\n${vip?.id ? `<@&${vip.id}>` : "*Role Not set*"}.\n\n**__Official__**\n${official?.id ? `<@&${official.id}>` : "*Role Not set*"}.`;

      return message.channel.send({ embeds: [new MessageEmbed().setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() }).setFooter({ text: `Developed with ❤️ by ${client.user.username} Development` }).setThumbnail(client.user.displayAvatarURL()).setColor(client.color).setDescription(description)] })
    } else {
      return message.channel.send({ embeds: [new MessageEmbed().setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() }).setFooter({ text: `Developed with ❤️ by ${client.user.username} Development` }).setColor(client.color).setDescription(`.\n\`${message.guild.prefix}setup add <name> <role>\`\nSetups a role with the provided name.\n\n\`${message.guild.prefix}setup remove <name>\`\nRemoves a role with the provided name.\n\n\`${message.guild.prefix}setup reqrole <role>\`\nSetups a requirement role.\n\n\`${message.guild.prefix}setup add girl <role>\`\nSetups a role for girls\n\n\`${message.guild.prefix}setup add guest <role>\`\nSetups a role for guests.\n\n\`${message.guild.prefix}setup add vip <role>\`\nSetups a role for vip members.\n\n\`${message.guild.prefix}setup add official <role>\`\nSetups a role for official mebers.\n\n\`${message.guild.prefix}setup list\`\nShows you the list of all custom roles.\n\n\`${message.guild.prefix}setup config\`\nShows you the configuration of custom roles.`)] })
    }
  }

}
async function Bitzxier(embed, client, message){
    let embeds = [], page = 0, i, k;
    let description = embed.description;
    description = description.split("\n");
    if(Array.isArray(description)){
      k = 10;
      for(i=0; i<description.length; i+=10){
        const current = description.slice(i, k);
        k += 10;
          const embed1 = new MessageEmbed()
            .setDescription(current.join("\n"))
            .setColor(client.color)
            .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) || client.user.displayAvatarURL()})
            .setThumbnail(client.user.displayAvatarURL())
          .setFooter({text: `Page: ${embeds.length + 1}`, iconURL: client.user.displayAvatarURL()})
        if(embed.title) embed1.setTitle(embed.title);
        if(embed.thumbnail) embed1.setThumbnail(embed.thumbnail.url);
        if(embed.image) embed1.setImage(embed.image);
          embeds.push(embed1);
      }
    }
      if (embeds.length === 0) return message.channel.send({
      embeds: [new MessageEmbed()
        .setDescription(`No Content added`)
               .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) || client.user.displayAvatarURL()})
               .setFooter({text: `Page: 0`, iconURL:  client.user.displayAvatarURL()})
        .setColor(client.color).setThumbnail(client.user.displayAvatarURL())
      ]
    })
    if (embeds.length === 1) return message.channel.send({
      embeds: [embeds[0]]
    }, message).then(m => {
        client.msg.set(message.id, {
          edit: m.id
        });
      });
   
    let button_back = new MessageButton().setStyle('SECONDARY').setCustomId('1').setEmoji("◀").setDisabled(true);
    let button_home = new MessageButton().setEmoji("⏹").setCustomId("2").setStyle("SECONDARY").setDisabled(false);
    let button_forward = new MessageButton().setStyle('SECONDARY').setCustomId('3').setEmoji('▶️').setDisabled(false);
     let first = new MessageButton().setStyle('SECONDARY').setCustomId('4').setEmoji("⏮").setDisabled(true);
    let last = new MessageButton().setStyle('SECONDARY').setCustomId('5').setEmoji("⏭").setDisabled(false);
    const allbuttons = [new MessageActionRow().addComponents([first, button_back, button_home, button_forward, last])]
    let swapmsg = await message.channel.send({
      embeds: [embeds[0]],
      components: allbuttons
    });
     
    const collector = swapmsg.createMessageComponentCollector({
      filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
      time: 60000
    }); 
    collector.on('collect', async b => {
      if (b.user.id !== message.member.id)
        return b.reply({
          content: `This isn't for you!`,
          ephemeral: true
        })
      if (b.customId == "1") {
        if (page !== 0) {
          if (page==1){
            button_back=button_back.setDisabled(true);
            first=first.setDisabled(true);
          }
            last=last.setDisabled(false);
            button_forward=button_forward.setDisabled(false);
          page -= 1;
           swapmsg.edit({
            embeds: [embeds[page]],
            components: [new MessageActionRow().addComponents([first, button_back, button_home,  button_forward, last])]
          })
          await b.deferUpdate();
        } else {
          page = embeds.length - 1;
           swapmsg.edit({
            embeds: [embeds[page]],
            components: allbuttons
          })
          await b.deferUpdate();
        }
      }
      else if (b.customId == "2") {
        await b.deferUpdate();
        if(swapmsg){
        button_back=button_back.setDisabled(true)
        button_forward=button_forward.setDisabled(true)
        button_home=button_home.setDisabled(true)
        first=first.setDisabled(true);
          last=last.setDisabled(true);
        swapmsg.edit({
          embeds: [embeds[page]],
            components: [new MessageActionRow().addComponents([first, button_back, button_home, button_forward, last])]
          })
      }
      }
      else if (b.customId == "3") {
        if (page < embeds.length - 1) {
          if(page==embeds.length-2){;
            button_forward=button_forward.setDisabled(true);
            last=last.setDisabled(true);
              }
              button_back=button_back.setDisabled(false);
              first=first.setDisabled(false);
          page++;
           swapmsg.edit({
            embeds: [embeds[page]],
            components: [new MessageActionRow().addComponents([first, button_back, button_home, button_forward, last])]
          })
          await b.deferUpdate();
        } else {
          page = 0
         swapmsg.edit({
            embeds: [embeds[page]],
            components: allbuttons
          })
          await b.deferUpdate();
        }
      } else if(b.customId == "4") {
        if (page !== 0) {
            button_back=button_back.setDisabled(true);
            first=first.setDisabled(true);
            button_forward=button_forward.setDisabled(false);
            last=last.setDisabled(false);
          page = 0;
         swapmsg.edit({
            embeds: [embeds[page]],
            components: [new MessageActionRow().addComponents([first, button_back, button_home,  button_forward, last])]
          })
          await b.deferUpdate();
        } else {
          page = embeds.length - 1;
         swapmsg.edit({
            embeds: [embeds[page]],
            components: allbuttons
          })
          await b.deferUpdate();
        }
      } else if (b.customId == "5") {
        if (page < embeds.length - 1) {
            button_forward=button_forward.setDisabled(true);
            last=last.setDisabled(true);
              button_back=button_back.setDisabled(false);
              first=first.setDisabled(false);
          page=embeds.length-1;
         swapmsg.edit({
            embeds: [embeds[page]],
            components: [new MessageActionRow().addComponents([first, button_back, button_home, button_forward, last])]
          })
          await b.deferUpdate();
        } else {
          page = 0
         swapmsg.edit({
            embeds: [embeds[page]],
            components: allbuttons
          })
          await b.deferUpdate();
        }
      }
    });
    collector.on("end", () => {
      if(swapmsg){
        button_back=button_back.setDisabled(true)
        button_forward=button_forward.setDisabled(true)
        button_home=button_home.setDisabled(true)
        last=last.setDisabled(true)
        first=first.setDisabled(true)
        swapmsg.edit({
            components: [new MessageActionRow().addComponents([first, button_back, button_home, button_forward, last])]
          })
      }
    });
  }
  