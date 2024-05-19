const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
module.exports = {
    name: 'autologs',
    aliases: ['autolog'],
    cooldown: 5,
    category: 'logging',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`MANAGE SERVER\` permissions to use this command.`
                        )
                ]
            });
        }
        if (!message.guild.me.permissions.has('ADMINISTRATOR')) { 
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I don't have \`Administrator\` permissions to execute this command.`
                        )
                ]
            })
        }

        if (!client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }
        let data = await client.db.get(`logs_${message.guild.id}`)
        if(!data){
            await client.db.set(`logs_${message.guild.id}`,{ 
                voice : null,
                channel : null,
                rolelog : null,
                modlog : null,   
                message : null,
                memberlog : null
            })
            const initialMessage = await message.channel.send({
                embeds: [new MessageEmbed().setColor(client.color).setDescription('Configuring your server...')],
              });
              await client.util.sleep(2000);
              initialMessage.edit({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.color)
                    .setTitle('Server Configuration Successful')
                    .setDescription('Your server has been successfully configured for logging.')
                    .setFooter({ text: 'Your server has been successfully configured for logging Run Command Again.!'})
                ],
              });
                      } 
        if(data.modlog || data.memberlog || data.message || data.channel || data.rolelog || data.voice ){

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Logging System is Already Set Up')
                        .setDescription('Your server already has a configured logging system.')
                        .addField('How to Reset Logging?', 'You can manage logging settings using the appropriate commands.')
                        .setFooter(`Note : If you wannna setup logging again use ${message.guild.prefix}logsreset & delete all existinglog channels of Satxler`, client.user.displayAvatarURL())
                ]
            });
            
                      
            } 


        try {
            let category = message.guild.channels.cache.find(c => c.type === 'GUILD_CATEGORY' && c.name === 'Satxler-LOGS');

            if (!category) {
                category = await message.guild.channels.create('Satxler-LOGS', {
                    type: 'GUILD_CATEGORY',
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ['VIEW_CHANNEL']
                        }
                    ]
                });
            }

            const channels = [
                { name: 'voicelogs', topic: 'This channel logs voice-related events.' },
                { name: 'channellogs', topic: 'This channel logs channel-related events.' },
                { name : 'rolelogs', topic: 'This channel logs role-related events.'},
                { name: 'modlogs', topic: 'This channel logs moderation events.' },
                { name: 'msglogs', topic: 'This channel logs message events.' },
                { name: 'memberlogs', topic: 'This channel logs member-related events.' },
            ];
            for (const channelData of channels) {
                    let check = await message.guild.channels.cache.find(ch => ch.name === channelData.name);
                    if (check) { 
                        return message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setTitle('Logging System is Already Set Up')
                                    .setDescription('Your server already has a configured logging system.')
                                    .addField('How to Reset Logging?', 'You can manage logging settings using the appropriate commands.')
                                    .setFooter(`Note : If you wannna setup logging again use ${message.guild.prefix}logsreset & delete all existinglog channels of Satxler`, client.user.displayAvatarURL())
                            ]
                        });
                    }
                
                await client.util.sleep(2000)
                await message.guild.channels.create(channelData.name, {
                    type: 'GUILD_TEXT',
                    topic: channelData.topic,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ['VIEW_CHANNEL']
                        }
                    ],
                    reason: 'Creating logging channels as part of autologs setup.'
                });
            }
let voicelog = await message.guild.channels.cache.find(channel => channel.name === 'voicelogs')
let channellog = await message.guild.channels.cache.find(channel => channel.name === 'channellogs')
let rolelog = await message.guild.channels.cache.find(channel => channel.name === 'rolelogs')
let modlog = await message.guild.channels.cache.find(channel => channel.name === 'modlogs')
let msglog = await message.guild.channels.cache.find(channel => channel.name === 'msglogs')
let memberlog = await message.guild.channels.cache.find(channel => channel.name === 'memberlogs')

    await client.db.set(`logs_${message.guild.id}`,{ 
        voice : voicelog.id,
        channel : channellog.id,
        rolelog : rolelog.id,
        modlog : modlog.id,   
        message : msglog.id,
        memberlog : memberlog.id
    })
    
    return message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor(client.color)
                .setTitle('Logging Channels Setup Complete')
                .setDescription('All necessary logging channels have been successfully created under the "Satxler LOGS" category.')
                .addField('Channels Created', '- **modlog:** Logs moderation-related events.\n- **memberlog:** Logs member-related events.\n- **msglog:** Logs message-related events.\n- **channellog:** Logs channel-related events.\n- **voicelog:** Logs voice-related events\n- **rolelog:** Logs role-related events.')
                .addField('Additional Configuration', 'You can further customize logging settings and manage permissions as needed.')
        ]
    });
    

        } catch (error) {
            if(error.code === 429) {
                await client.util.handleRateLimit()
            }
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription('An error occurred while creating logging channels.')
                ]
            });
        }
    }
};
