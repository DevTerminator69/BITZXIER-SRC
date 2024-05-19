const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    premium: true,
    run: async (client, message, args) => {
        let prefix = message.guild?.prefix;

        const ANTINUKE = new MessageButton()
            .setEmoji('<:Satxler_ant:1218110681488953404>')
            .setCustomId('antinuke')
            .setStyle('SECONDARY'); 
            const MOD = new MessageButton()
            .setEmoji('<:Satxler_mod:1218111484861874226>')
            .setCustomId('mod')
            .setStyle('SECONDARY'); 
            const INFO = new MessageButton()
            .setEmoji('<:Satxler_Uti:1218112303380168724>')
            .setCustomId('info')
            .setStyle('SECONDARY'); 
            const WELCOME = new MessageButton()
            .setEmoji('<<:Satxler_Wel:1218112881879679016>')
            .setCustomId('welcomer')
            .setStyle('SECONDARY'); 
            const VOICE = new MessageButton()
            .setEmoji('<:Satxler_Mic:1218113777824694362>')
            .setCustomId('voice')
            .setStyle('SECONDARY'); 
            const CUSTOM = new MessageButton()
            .setEmoji('<:Customrole:1199024011045253140>')
            .setCustomId('customrole')
            .setStyle('SECONDARY'); 
            const LOGS = new MessageButton()
            .setEmoji('<:logs:1200416495461732353>')
            .setCustomId('logging')
            .setStyle('SECONDARY'); 
            const AUTOMOD = new MessageButton()
            .setEmoji('<:Satxler_Auto:1218177653840805978>')
            .setCustomId('automod')
            .setStyle('SECONDARY'); 
            const ALL = new MessageButton()
            .setLabel('All Commands')
            .setCustomId('all')
            .setStyle('SUCCESS'); 
        const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]);
        const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('helpop')
                .setPlaceholder(`❯ ${client.user.username} Get Started!`)
                .addOptions([
                  {
                      label: ' AntiNuke',
                      description: 'Get All AntiNuke Command List',
                      value: 'first',
                      emoji: '<:Satxler_ant:1218110681488953404>'
                  },
                  {
                      label: ' Moderation',
                      description: 'Get All Moderation Command List',
                      value: 'second',
                      emoji: '<:Satxler_mod:1218111484861874226>'
                  },
                  {
                      label: 'Utility',
                      description: 'Get All Utility Command List',
                      value: 'third',
                      emoji: '<:Satxler_Uti:1218112303380168724>'
                  },
                  {
                      label: 'Welcomer',
                      description: 'Get All Welcomer Command List',
                      value: 'fourth',
                      emoji: '<<:Satxler_Wel:1218112881879679016>'
                  },
                  {
                      label: 'Voice',
                      description: 'Get All Voice Command List',
                      value: 'fifth',
                      emoji: '<:Satxler_Mic:1218113777824694362>'
                  },
                  {
                      label: 'Customrole',
                      description: 'Get All Customrole Command List',
                      value: 'six',
                      emoji: '<:Customrole:1199024011045253140>'
                  },
                  {
                      label: 'Logger',
                      description: 'Get All Logger Command List',
                      value: 'seven',
                      emoji: '<:logs:1200416495461732353>'
                  },
                  {
                      label: 'Automod',
                      description: 'Get All Automod Command List',
                      value: 'eight',
                      emoji: '<:Satxler_Auto:1218177653840805978>'
                  }
              ])
        );

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic : true}))
            .setDescription(
                `** Prefix for this server** \`${prefix}\`\n ** Total Commands:** \`${client.commands.size}\`**\n[Invite Me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) | [Support Server](https://discord.gg/5p6z8kh8sP)**\n\n**Type** \`${prefix}antinuke enable\` **to get started up!**`
            )

        const helpMessage = await message.channel.send({ embeds: [embed], components: [row, row2 ,row3] });

        const collector = helpMessage.createMessageComponentCollector({
            filter: (i) => i.user && i.isButton(),
            time: 60000
        });
        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id)
                return i.reply({
                    content: `Only ${message.author} Can Use This Intraction`,
                    ephemeral: true
                });
            if (i.isButton()) {
                if (i.customId == 'antinuke') {
                    i.deferUpdate();
        
                    const em = new MessageEmbed()
                    let _commands
                    em.setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        em.setThumbnail(
                            i.guild.iconURL({
                                dynamic: true
                            })
                        )
                        em.setColor(client.color)
                        _commands = client.commands
                            .filter((x) => x.category && x.category === 'security')
                            .map((x) => `\`${x.name}\``)
                            em.addField(
                            `**<:Satxler_ant:1218110681488953404> Antinuke \`[${_commands.length}]\`**`,
                            _commands.sort().join(', ')
                        )

                    ANTINUKE.setDisabled(true);
                    MOD.setDisabled(false);
                    INFO.setDisabled(false);
                    WELCOME.setDisabled(false);
                    VOICE.setDisabled(false);
                    CUSTOM.setDisabled(false);
                    LOGS.setDisabled(false);
                    AUTOMOD.setDisabled(false);
                    ALL.setDisabled(false);
                    const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]);
                    const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);
                    if (helpMessage)
                    return helpMessage.edit({ embeds: [em], components: [row, row2,row3] });

                } if (i.customId == 'mod') {
                    i.deferUpdate();
        
                    const em = new MessageEmbed()
                    let _commands
                    em.setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        em.setThumbnail(
                            i.guild.iconURL({
                                dynamic: true
                            })
                        )
                        em.setColor(client.color)
                        _commands = client.commands
                            .filter((x) => x.category && x.category === 'mod')
                            .map((x) => `\`${x.name}\``)
                            em.addField(
                                `**<:Satxler_mod:1218111484861874226> Moderation \`[${_commands.length}]\`**`,
                                _commands.sort().join(', ')
                        )

                        ANTINUKE.setDisabled(false);
                        MOD.setDisabled(true);
                        INFO.setDisabled(false);
                        WELCOME.setDisabled(false);
                        VOICE.setDisabled(false);
                        CUSTOM.setDisabled(false);
                        LOGS.setDisabled(false);
                        AUTOMOD.setDisabled(false);
                        ALL.setDisabled(false);

                        const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]);
                        const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);

                    if (helpMessage)
                    return helpMessage.edit({ embeds: [em], components: [row, row2,row3] });

                } if (i.customId == 'info') {
                    i.deferUpdate();
        
                    const em = new MessageEmbed()
                    let _commands
                    em.setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        em.setThumbnail(
                            i.guild.iconURL({
                                dynamic: true
                            })
                        )
                        em.setColor(client.color)
                        _commands = client.commands
                            .filter((x) => x.category && x.category === 'info')
                            .map((x) => `\`${x.name}\``)
                            em.addField(
                                `**<:Satxler_Uti:1218112303380168724> Utility \`[${_commands.length}]\`**`,
                                _commands.sort().join(', ')
                        )

                        ANTINUKE.setDisabled(false);
                        MOD.setDisabled(false);
                        INFO.setDisabled(true);
                        WELCOME.setDisabled(false);
                        VOICE.setDisabled(false);
                        CUSTOM.setDisabled(false);
                        LOGS.setDisabled(false);
                        AUTOMOD.setDisabled(false);
                        ALL.setDisabled(false);


                        const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]);    
                        const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);
             
                   if (helpMessage)
                   return helpMessage.edit({ embeds: [em], components: [row, row2,row3] });

                } if (i.customId == 'welcomer') {
                    i.deferUpdate();
        
                    const em = new MessageEmbed()
                    let _commands
                    em.setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        em.setThumbnail(
                            i.guild.iconURL({
                                dynamic: true
                            })
                        )
                        em.setColor(client.color)
                        _commands = client.commands
                            .filter((x) => x.category && x.category === 'welcomer')
                            .map((x) => `\`${x.name}\``)
                            em.addField(
                                `**<<:Satxler_Wel:1218112881879679016> Welcomer \`[${_commands.length}]\`**`,
                                _commands.sort().join(', ')
                        )

                        ANTINUKE.setDisabled(false);
                        MOD.setDisabled(false);
                        INFO.setDisabled(false);
                        WELCOME.setDisabled(true);
                        VOICE.setDisabled(false);
                        CUSTOM.setDisabled(false);
                        LOGS.setDisabled(false);
                        AUTOMOD.setDisabled(false);
                        ALL.setDisabled(false);

                        const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]); 
                        const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);
         
                      if (helpMessage)
                      return helpMessage.edit({ embeds: [em], components: [row, row2,row3] });

                } if (i.customId == 'voice') {
                    i.deferUpdate();
        
                    const em = new MessageEmbed()
                    let _commands
                    em.setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        em.setThumbnail(
                            i.guild.iconURL({
                                dynamic: true
                            })
                        )
                        em.setColor(client.color)
                        _commands = client.commands
                            .filter((x) => x.category && x.category === 'voice')
                            .map((x) => `\`${x.name}\``)
                            em.addField(
                                `**<:Satxler_Mic:1218113777824694362> Voice \`[${_commands.length}]\`**`,
                                _commands.sort().join(', ')
                        )

                        ANTINUKE.setDisabled(false);
                        MOD.setDisabled(false);
                        INFO.setDisabled(false);
                        WELCOME.setDisabled(false);
                        VOICE.setDisabled(true);
                        CUSTOM.setDisabled(false);
                        LOGS.setDisabled(false);
                        AUTOMOD.setDisabled(false);
                        ALL.setDisabled(false);


                        const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]);  
                        const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);
     
                     if (helpMessage)
                     return helpMessage.edit({ embeds: [em], components: [row, row2,row3] });

                } if (i.customId == 'customrole') {
        
                    i.deferUpdate(); 

                    const em = new MessageEmbed()
                        .setAuthor(client.user.username, client.user.displayAvatarURL())
                        .setThumbnail(i.guild.iconURL({ dynamic: true }))
                        .setColor(client.color)
                    let cmd = [];
                    client.commands
                        .filter((x) => x.category && x.category === 'customrole')
                        .forEach((x) => {
                            cmd.push(`\`${x.name}\``);
                            if (x.subcommand.length) {
                                x.subcommand.forEach((y) => {
                                    cmd.push(`\`${x.name} ${y}\``);
                                });
                            }
                        });
                
                    em.addField(`**<:Customrole:1199024011045253140> Customrole \`[${cmd.length}]\`**`, cmd.sort().join(', '));                

                        ANTINUKE.setDisabled(false);
                        MOD.setDisabled(false);
                        INFO.setDisabled(false);
                        WELCOME.setDisabled(false);
                        VOICE.setDisabled(false);
                        CUSTOM.setDisabled(true);
                        LOGS.setDisabled(false);
                        AUTOMOD.setDisabled(false);
                        ALL.setDisabled(false);

                        const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]);       
                        const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);

                     if (helpMessage)
                     return helpMessage.edit({ embeds: [em], components: [row, row2,row3] });

                }  if (i.customId == 'logging') {
                    i.deferUpdate();
        
                    const em = new MessageEmbed()
                    let _commands
                    em.setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })

                        em.setThumbnail(
                            i.guild.iconURL({
                                dynamic: true
                            })
                        )
                        em.setColor(client.color)
                        _commands = client.commands
                            .filter((x) => x.category && x.category === 'logging')
                            .map((x) => `\`${x.name}\``)
                            em.addField(
                                `**<:logs:1200416495461732353> Logging  \`[${_commands.length}]\`**`,
                                _commands.sort().join(', ')
                        )

                        ANTINUKE.setDisabled(false);
                        MOD.setDisabled(false);
                        INFO.setDisabled(false);
                        WELCOME.setDisabled(false);
                        VOICE.setDisabled(false);
                        CUSTOM.setDisabled(false);
                        LOGS.setDisabled(true);
                        AUTOMOD.setDisabled(false);
                        ALL.setDisabled(false);

                        const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]);  
                        const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);
     
                     if (helpMessage)
                     return helpMessage.edit({ embeds: [em], components: [row, row2,row3] });

                }  if (i.customId == 'automod') {
                    i.deferUpdate();
        
                    const em = new MessageEmbed()
                    let _commands
                    em.setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        em.setThumbnail(
                            i.guild.iconURL({
                                dynamic: true
                            })
                        )
                        em.setColor(client.color)
                        let cmd = []
                        client.commands
                            .filter((x) => x.category && x.category === 'automod')
                            .forEach((x) => {
                                cmd.push(`\`${x.name}\``)
                                if (x.subcommand.length) {
                                    x.subcommand.forEach((y) => {
                                        cmd.push(`\`${x.name} ${y}\``)
                                    })
                                }
                            })
                            em.addField(
                            `**<:Satxler_Auto:1218177653840805978> Automod \`[${cmd.length}]\`**`,
                            cmd.sort().join(', ')
                        )

                        ANTINUKE.setDisabled(false);
                        MOD.setDisabled(false);
                        INFO.setDisabled(false);
                        WELCOME.setDisabled(false);
                        VOICE.setDisabled(false);
                        CUSTOM.setDisabled(false);
                        LOGS.setDisabled(false);
                        AUTOMOD.setDisabled(true);
                        ALL.setDisabled(false);

                        const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]);  
                        const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);
     
                     if (helpMessage)
                     return helpMessage.edit({ embeds: [em], components: [row, row2,row3] });

                 } if (i.customId == 'all') {
                    i.deferUpdate();
        
                    const em = new MessageEmbed()
                    em.setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        
                        em.setThumbnail(client.user.displayAvatarURL({ dynamic : true}))

                        em.setColor(client.color)
                        _commands = client.commands
                        .filter((x) => x.category && x.category === 'security')
                        .map((x) => `\`${x.name}\``)
                        em.addField(
                        `**<:Satxler_ant:1218110681488953404> Antinuke \`[${_commands.length}]\`**`,
                        _commands.sort().join(', ')
                    )
                    _commands = client.commands
                        .filter((x) => x.category && x.category === 'mod')
                        .map((x) => `\`${x.name}\``)
                        em.addField(
                            `**<:Satxler_mod:1218111484861874226> Moderation \`[${_commands.length}]\`**`,
                            _commands.sort().join(', ')
                    )
                    _commands = client.commands
                    .filter((x) => x.category && x.category === 'info')
                    .map((x) => `\`${x.name}\``)
                    em.addField(
                        `**<:Satxler_Uti:1218112303380168724> Utility \`[${_commands.length}]\`**`,
                        _commands.sort().join(', ')
                )                       
                 _commands = client.commands
                .filter((x) => x.category && x.category === 'welcomer')
                .map((x) => `\`${x.name}\``)
                em.addField(
                    `**<<:Satxler_Wel:1218112881879679016> Welcomer \`[${_commands.length}]\`**`,
                    _commands.sort().join(', ')
            )
            _commands = client.commands
            .filter((x) => x.category && x.category === 'voice')
            .map((x) => `\`${x.name}\``)
            em.addField(
                `**<:Satxler_Mic:1218113777824694362> Voice \`[${_commands.length}]\`**`,
                _commands.sort().join(', ')
        )
        let cmd = [];
        client.commands
            .filter((x) => x.category && x.category === 'customrole')
            .forEach((x) => {
                cmd.push(`\`${x.name}\``);
                if (x.subcommand.length) {
                    x.subcommand.forEach((y) => {
                        cmd.push(`\`${x.name} ${y}\``);
                    });
                }
            });
    
        em.addField(`**<:Customrole:1199024011045253140> Customrole \`[${cmd.length}]\`**`, cmd.sort().join(', '));

        _commands = client.commands
        .filter((x) => x.category && x.category === 'logging')
        .map((x) => `\`${x.name}\``)
        em.addField(
            `**<:logs:1200416495461732353> Logging  \`[${_commands.length}]\`**`,
            _commands.sort().join(', ')
    ) 
    let cmdd = [];

     client.commands
    .filter((x) => x.category && x.category === 'automod')
     .forEach((x) => {
        cmdd.push(`\`${x.name}\``)
        if (x.subcommand.length) {
            x.subcommand.forEach((a) => {
                cmdd.push(`\`${x.name} ${a}\``)
            })
        }
    })
    em.addField(
    `**<:Satxler_Auto:1218177653840805978> Automod \`[${cmdd.length}]\`**`,
    cmdd.sort().join(', ')
)

                        ANTINUKE.setDisabled(false);
                        MOD.setDisabled(false);
                        INFO.setDisabled(false);
                        WELCOME.setDisabled(false);
                        VOICE.setDisabled(false);
                        CUSTOM.setDisabled(false);
                        LOGS.setDisabled(false);
                        AUTOMOD.setDisabled(false);
                        ALL.setDisabled(true);

                        const row2 = new MessageActionRow().addComponents([ANTINUKE,MOD,INFO,WELCOME,VOICE]);  
                        const row3 = new MessageActionRow().addComponents([CUSTOM,LOGS,AUTOMOD,ALL]);
     
                     if (helpMessage)
                     return helpMessage.edit({ embeds: [em], components: [row, row2,row3] });

                }

            }
        })
        collector.on('end', collected => {
            if (collected.size === 0) {
                ANTINUKE.setDisabled(true);
                MOD.setDisabled(true);
                INFO.setDisabled(true);
                WELCOME.setDisabled(true);
                VOICE.setDisabled(true);
                CUSTOM.setDisabled(true);
                LOGS.setDisabled(true);
                AUTOMOD.setDisabled(true);
                ALL.setDisabled(true);
                const row2 = new MessageActionRow().addComponents([ANTINUKE, MOD, INFO, WELCOME, VOICE]);  
                const row3 = new MessageActionRow().addComponents([CUSTOM, LOGS, AUTOMOD, ALL]);
                if (helpMessage) {
                    return helpMessage.edit({ components: [row, row2, row3] });
                }
            }
        });
        
        
     }
    }

