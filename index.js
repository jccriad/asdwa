const {
    Client,
    EmbedBuilder,
    ChannelType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    GatewayIntentBits,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    PermissionOverwrites,
    PermissionOverwriteManager,
    PermissionsBitField 
} = require('discord.js');
const {
    TicketPanelMessage,
    TicketInformationMessage,
    SupportTicketOpenMessage
} = require('./messages.js');
const { createTranscript } = require('discord-html-transcripts');
const { green, yellow, blue, red, white, black } = require('chalk');

let openTickets = 0;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

function print(msg) {
    const fmsg = `${red(`discord.gg/pashacity`)} ${yellow(`>>>`)} ${green(`${msg}`)}`;
    console.log(fmsg);
}

function handleError(err) {
    print(err.message);
}

async function updateStatsChannel(guild) {
    openTickets = 0;
    guild.channels.cache.forEach(async function(channel) {
        if (channel.name.includes("👨‍💻┃") ||
            channel.name.includes("😎┃") ||
            channel.name.includes("📋┃") ||
            channel.name.includes("🚀┃") ||
            channel.name.includes("💰┃") ||
            channel.name.includes("📣┃")
        ) {
            openTickets++;
        }
    });

    let formatTicket = openTickets + 12;

    setTimeout(async function() {
        guild.channels.cache.get("1150102725950967889").setName("💚┃Tickets: " + formatTicket);
    }, 3500);

    setTimeout(async function() {
        updateStatsChannel(client.guilds.cache.get("1143523462086926388"));
    }, 5000);
}

client.on('ready', async (client) => {
    console.clear();
    print('Der Bot hat sich Erfolgreich Eingelogt!');
    updateStatsChannel(client.guilds.cache.get("1143523462086926388"));
});

client.on('messageCreate', async (message) => {

    const command = message.content.toLowerCase();

    if (message.author.bot) return;

    if (command.startsWith('.panel')) {
        const allowed = ['ゝ।  Projektleitung','ゝ।  Stv. Projektleitung','ゝ। 🐒','ゝ। 🦁','ゝ। 💗','ゝ।🏆'];
        const member = message.member;
        const hasAllowedRole = allowed.some(roleName => {
            const role = member.roles.cache.find(r => r.name === roleName);
            return !!role;
        });

        if (hasAllowedRole) {
            const Embed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('TICKET-SYSTEM')
            .setDescription(TicketPanelMessage)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Ticket Öffnen')
                .setEmoji('🎫')
                .setStyle(ButtonStyle.Success)
                .setCustomId('open_ticket_select_menu'),

                new ButtonBuilder()
                .setLabel('Ticket Information')
                .setEmoji('🚀')
                .setStyle(ButtonStyle.Success)
                .setCustomId('open_ticket_information'),
            )

            return message.channel.send({ embeds: [Embed], components: [buttons] }).catch((err) => {
                handleError(err);
            });
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.user.bot) return;

    if (interaction.customId === 'open_ticket_information') {
        const Embed = new EmbedBuilder()
        .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
        .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142333552595004/information.png')
        .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
        .setTitle('TICKET-SYSTEM')
        .setDescription(TicketInformationMessage)
        .setTimestamp()
        .setColor('#49ff00')
        .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

        return interaction.reply({ embeds: [Embed], ephemeral: true }).catch((err) => {
            handleError(err);
        });
    } else if (interaction.customId === 'open_ticket_select_menu') {
        const select_menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('ticket_selectmenu')
            .setPlaceholder('Wähle ein Ticket aus!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel('Support Ticket')
                .setDescription('Wenn du hier klickst Öffnest du ein Support Ticket.')
                .setEmoji('👨‍💻')
                .setValue('open_ticket__support'),

                new StringSelectMenuOptionBuilder()
                .setLabel('Fraktions Ticket')
                .setDescription('Wenn du hier klickst Öffnest du ein Fraktions Ticket.')
                .setEmoji('😎')
                .setValue('open_ticket__fraktion'),

                new StringSelectMenuOptionBuilder()
                .setLabel('Teambewerbungs Ticket')
                .setDescription('Wenn du hier klickst Öffnest du ein Teambewerbungs Ticket.')
                .setEmoji('📋')
                .setValue('open_ticket__team'),

                new StringSelectMenuOptionBuilder()
                .setLabel('Highteam Ticket')
                .setDescription('Wenn du hier klickst Öffnest du ein Highteam Ticket.')
                .setEmoji('🚀')
                .setValue('open_ticket__highteam'),

                new StringSelectMenuOptionBuilder()
                .setLabel('Spenden Ticket')
                .setDescription('Wenn du hier klickst Öffnest du ein Spenden Ticket.')
                .setEmoji('💰')
                .setValue('open_ticket__donation'),

                new StringSelectMenuOptionBuilder()
                .setLabel('Team-Beschwerde Ticket')
                .setDescription('Wenn du hier klickst Öffnest du ein Team-Beschwerde Ticket.')
                .setEmoji('📣')
                .setValue('open_ticket__teambeschwerde'),
            ),
        );

        return interaction.reply({ components: [select_menu], ephemeral: true }).catch((err) => {
            handleError(err);
        });
    } else if (interaction.customId === 'ticket_selectmenu') {
        let ticket_type = '';

        await interaction.values.forEach(async (value) => {
            ticket_type += `${value}`
        });

        if (ticket_type === 'open_ticket__support') {
            const Embed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Support Ticket')
            .setDescription(SupportTicketOpenMessage)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            const newTicket = await interaction.guild.channels.create({
                name: `👨‍💻┃${interaction.user.username}`,
                parent: '1143526012160835614',
                type: ChannelType.GuildText,
                topic: `👨‍💻┃${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: '1143525969597055036',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                ],
            }).catch((err)=>{logfile(err)});

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Schließen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🙅')
                .setCustomId('close_ticket'),

                new ButtonBuilder()
                .setLabel('Transcript')
                .setStyle(ButtonStyle.Success)
                .setEmoji('📦')
                .setCustomId('transcript_ticket'),
            )

            newTicket.send({ content: `<@${interaction.user.id}> × <@&1149444921091170436>`, embeds: [Embed], components: [buttons] }).catch((err) => {
                handleError(err);
            });

            const openEmbed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Ticket-System')
            .setDescription(`Dein Ticket wurde **Erfolgreich** Erstellt!\n<#${newTicket.id}>`)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            return interaction.reply({ embeds: [openEmbed], ephemeral: true }).catch((err) => {
                handleError(err);
            });
        } else if (ticket_type === 'open_ticket__fraktion') {
            const Embed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Fraktions Ticket')
            .setDescription(SupportTicketOpenMessage)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            const newTicket = await interaction.guild.channels.create({
                name: `😎┃${interaction.user.username}`,
                parent: '1143526014572580905',
                type: ChannelType.GuildText,
                topic: `😎┃${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: '1143525941969174600',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: '1145049853836136500',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                ],
            }).catch((err)=>{logfile(err)});

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Schließen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🙅')
                .setCustomId('close_ticket'),

                new ButtonBuilder()
                .setLabel('Transcript')
                .setStyle(ButtonStyle.Success)
                .setEmoji('📦')
                .setCustomId('transcript_ticket'),
            )

            newTicket.send({ content: `<@${interaction.user.id}> × <@&1149444921091170436>`, embeds: [Embed], components: [buttons] }).catch((err) => {
                handleError(err);
            });
            
            const openEmbed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Ticket-System')
            .setDescription(`Dein Ticket wurde **Erfolgreich** Erstellt!\n<#${newTicket.id}>`)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            return interaction.reply({ embeds: [openEmbed], ephemeral: true }).catch((err) => {
                handleError(err);
            });
        } else if (ticket_type === 'open_ticket__team') {
            const Embed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Teambewerbungs Ticket')
            .setDescription(SupportTicketOpenMessage)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            const newTicket = await interaction.guild.channels.create({
                name: `📋┃${interaction.user.username}`,
                parent: '1143526015625334845',
                type: ChannelType.GuildText,
                topic: `📋┃${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: '1143525929486917714',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: '1143525928434143253',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: '1143525927465271346',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: '1143525926429270057',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                ],
            }).catch((err)=>{logfile(err)});

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Schließen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🙅')
                .setCustomId('close_ticket'),

                new ButtonBuilder()
                .setLabel('Transcript')
                .setStyle(ButtonStyle.Success)
                .setEmoji('📦')
                .setCustomId('transcript_ticket'),
            )

            newTicket.send({ content: `<@${interaction.user.id}> × <@&1149444921091170436>`, embeds: [Embed], components: [buttons] }).catch((err) => {
                handleError(err);
            });
            
            const openEmbed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Ticket-System')
            .setDescription(`Dein Ticket wurde **Erfolgreich** Erstellt!\n<#${newTicket.id}>`)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            return interaction.reply({ embeds: [openEmbed], ephemeral: true }).catch((err) => {
                handleError(err);
            });
        } else if (ticket_type === 'open_ticket__highteam') {
            const Embed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Highteam Ticket')
            .setDescription(SupportTicketOpenMessage)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            const newTicket = await interaction.guild.channels.create({
                name: `🚀┃${interaction.user.username}`,
                parent: '1150094219919241357',
                type: ChannelType.GuildText,
                topic: `🚀┃${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: '1143525931370160259',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                ],
            }).catch((err)=>{logfile(err)});

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Schließen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🙅')
                .setCustomId('close_ticket'),

                new ButtonBuilder()
                .setLabel('Transcript')
                .setStyle(ButtonStyle.Success)
                .setEmoji('📦')
                .setCustomId('transcript_ticket'),
            )

            newTicket.send({ content: `<@${interaction.user.id}> × <@&1149444921091170436>`, embeds: [Embed], components: [buttons] }).catch((err) => {
                handleError(err);
            });
            
            const openEmbed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Ticket-System')
            .setDescription(`Dein Ticket wurde **Erfolgreich** Erstellt!\n<#${newTicket.id}>`)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            return interaction.reply({ embeds: [openEmbed], ephemeral: true }).catch((err) => {
                handleError(err);
            });
        } else if (ticket_type === 'open_ticket__donation') {
            const Embed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Spenden Ticket')
            .setDescription(SupportTicketOpenMessage)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            const newTicket = await interaction.guild.channels.create({
                name: `💰┃${interaction.user.username}`,
                parent: '1143526017579884684',
                type: ChannelType.GuildText,
                topic: `💰┃${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: '1143525914404196352',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                ],
            }).catch((err)=>{logfile(err)});

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Schließen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🙅')
                .setCustomId('close_ticket'),

                new ButtonBuilder()
                .setLabel('Transcript')
                .setStyle(ButtonStyle.Success)
                .setEmoji('📦')
                .setCustomId('transcript_ticket'),
            )

            newTicket.send({ content: `<@${interaction.user.id}> × <@&1149444921091170436>`, embeds: [Embed], components: [buttons] }).catch((err) => {
                handleError(err);
            });
            
            const openEmbed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Ticket-System')
            .setDescription(`Dein Ticket wurde **Erfolgreich** Erstellt!\n<#${newTicket.id}>`)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            return interaction.reply({ embeds: [openEmbed], ephemeral: true }).catch((err) => {
                handleError(err);
            });
        } else if (ticket_type === 'open_ticket__teambeschwerde') {
            const Embed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Team-Beschwerde Ticket')
            .setDescription(SupportTicketOpenMessage)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            const newTicket = await interaction.guild.channels.create({
                name: `📣┃${interaction.user.username}`,
                parent: '1150095143521747017',
                type: ChannelType.GuildText,
                topic: `📣┃${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: '1143525929486917714',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: '1143525928434143253',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: '1143525927465271346',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: '1143525926429270057',
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'SendVoiceMessages'],
                    },
                ],
            }).catch((err)=>{logfile(err)});

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Schließen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🙅')
                .setCustomId('close_ticket'),

                new ButtonBuilder()
                .setLabel('Transcript')
                .setStyle(ButtonStyle.Success)
                .setEmoji('📦')
                .setCustomId('transcript_ticket'),
            )

            newTicket.send({ content: `<@${interaction.user.id}> × <@&1149444921091170436>`, embeds: [Embed], components: [buttons] }).catch((err) => {
                handleError(err);
            });
            
            const openEmbed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Ticket-System')
            .setDescription(`Dein Ticket wurde **Erfolgreich** Erstellt!\n<#${newTicket.id}>`)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            return interaction.reply({ embeds: [openEmbed], ephemeral: true }).catch((err) => {
                handleError(err);
            });
        }
    } else if (interaction.customId === 'close_ticket') {
        const Embed = new EmbedBuilder()
        .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
        .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
        .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
        .setTitle('Ticket-Ticket')
        .setDescription(`Dieses Ticket wurde von <@${interaction.user.id}> Geschlossen!`)
        .setTimestamp()
        .setColor('#49ff00')
        .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('transcript_ticket')
            .setStyle(ButtonStyle.Success)
            .setLabel('Transcript')
            .setEmoji('📦'),

            new ButtonBuilder()
            .setCustomId('delete_ticket')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Löschen')
            .setEmoji('🗑️'),
        );

        interaction.reply({ embeds: [Embed], components: [buttons] }).catch((err)=>{logfile(err)});

        interaction.channel.permissionOverwrites.set([
            {
                id: interaction.guild.roles.everyone.id,
                deny: ['ViewChannel'],
            },
            {
                id: '1143525969597055036',
                allow: ['ViewChannel'],
            },
        ]);

        interaction.channel.edit({
            parent: '1143526018712358932'
        });
    } else if (interaction.customId === 'transcript_ticket') {
        const attachment = await createTranscript(interaction.channel, {
            saveImages: true,
            limit: -1,
            returnBuffer: false,
            filename: 'transcript.html',
            footerText: 'TICKET-SYSTEM BY ZZFXNN',
            poweredBy: false,
            favicon: 'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif',
        }).catch((err) => {
            handleError(err);
        });

        interaction.guild.channels.cache.get('1143940431093178489').send({ files: [attachment] }).catch((err) => {
            handleError(err);
        }).then((msg) => {
            const Embed = new EmbedBuilder()
            .setAuthor({name:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})
            .setImage('https://cdn.discordapp.com/attachments/1143526331162828831/1149142379631218789/ticket-system.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif')
            .setTitle('Ticket-Ticket')
            .setDescription(`<@${interaction.user.id}> hat von diesem Ticket in Transcript Erstellt!\n[Transcript Herunterladen](${msg.attachments.first().url})`)
            .setTimestamp()
            .setColor('#49ff00')
            .setFooter({text:'PASHACITY ROLEPLAY',iconURL:'https://cdn.discordapp.com/attachments/1143526331162828831/1143625830002593863/P-gggg-aniamtiondnad.gif'})

            interaction.reply({ embeds: [Embed] }).catch((err) => {
                handleError(err);
            })
        });
    } else if (interaction.customId === 'delete_ticket') {
        return interaction.channel.delete().catch((err) => {
            handleError(err);
        });
    }
});

client.login('MTE0OTQxMjAzMDE4OTY2NjMyNQ.GnlUH4.by2eil5U_ZSnHpoMQnQK-j_ysHBj-advu8L9BQ');
