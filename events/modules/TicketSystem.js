const { Modal, TextInputComponent, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const moment = require('moment');
const WebTranscript = require('../../util/WebTranscript');

module.exports = async (client, interaction, data) => {
    const mod = data.guild.modules.tickets;
    if (interaction.customId.startsWith('ticketpanel')) {
        // Check configuration
        if (!mod.category || !mod.staff) return interaction.error("The ticket panel has not been configured.", true);
        
        // Check ticket ban
        const ban = data.member.other.ticketban;
        if (ban?.banned) {
            if (ban.until < Date.now() / 1000) {
                ban.banned = false;
                data.member.markModified('other.ticketban.banned');
                await data.member.save();
            } else {
                return interaction.error(`You are banned from using tickets ${ban.forever ? 'until its removed by a staff member.' : `, you will be unbanned <t:${ban.until}:R>`}`, true)
            }
        }
        
        // Check if the member has a ticket already
        if (data.member.other.ticket) {
            return interaction.error(`You already have a ticket open! If this is an error, ask a staff member to close your ticket.`, true )
        }

        // Check if member has agreed to rules
        if (!data.member.other.ticketrules && mod.rules.enabled) {
            return interaction.error(`You must agree to the ticket rules to create a ticket <#${mod.rules.channel}>.`, true)
        }

        // Display modal
        const ReasonModal = new Modal()
            .setCustomId(`ticketreason-${interaction.user.id}`)
            .setTitle('Ticket Creation')
            .addComponents(
                new MessageActionRow({
                    components: [
                        new TextInputComponent()
                            .setCustomId('ticket-reason-input')
                            .setLabel(`Ticket Reason`)
                            .setStyle('SHORT')
                            .setMinLength(1)
                            .setMaxLength(100)
                            .setPlaceholder(`Write your reason for creating a ticket here.`)
                            .setRequired(true)
                ]})
            );

        await interaction.showModal(ReasonModal);
    }
    if (interaction.customId.startsWith('ticketreason')) {
        const reason = interaction.fields.getTextInputValue('ticket-reason-input');
        interaction.guild.channels.create('ticket-' + (++mod.count), {
            type: `text`,
            parent: mod.category,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
                },
                {
                    id: client.user.id,
                    allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`, `ATTACH_FILES`, `READ_MESSAGE_HISTORY`, `EMBED_LINKS`]
                },
                {
                    id: interaction.user.id,
                    allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`, `ATTACH_FILES`, `READ_MESSAGE_HISTORY`, `EMBED_LINKS`]
                },
                {
                    id: mod.staff,
                    allow: [`VIEW_CHANNEL`, `ATTACH_FILES`, `READ_MESSAGE_HISTORY`, `EMBED_LINKS`, `SEND_MESSAGES`],
                },
            ],
            reason: `User requested a new support ticket channel`
        }).then(async c => {
            await interaction.deferReply({ ephemeral: true })
            interaction.followUp({ content: `Your ticket has been created. <#${c.id}>` })

            data.member.other.ticket = {
                channel: c.id,
            }
            mod.collection[c.id] = {
                owner: interaction.user.id,
                closed: false,
                created: Date.now(),
                reason: reason,
                num: mod.count,
            }
            data.member.markModified("other.ticket");
            await data.member.save();
            data.guild.markModified("modules.tickets");
            await data.guild.save();

            const staff = mod.staff;
            await c.send(`${(await interaction.member.roles.cache.some(role => role.id === staff)) ? `` : `<@&${staff}>`}` + ` <@${interaction.user.id}> has created a new ticket with reason: \`\`\`${reason}\`\`\``);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`ticketclose-${interaction.user.id}`)
                        .setLabel(`Close Ticket`)
                        .setEmoji(`🔒`)
                        .setStyle(`DANGER`),
                );
            const embed = new MessageEmbed({
                author: {
                    name: `${interaction.user.username}`,
                    icon_url: `${interaction.user.displayAvatarURL()}`,
                },
                description: `<@!${interaction.user.id}> Welcome! A member of staff will assist you shortly. In the mean time, please describe your issue in as much detail as possible.`,
                color: client.config.color
            })

            c.send({ embeds: [embed], components: [row] })
        })
    }
    if (interaction.customId.startsWith('ticketclose')) {
        if (mod.collection[interaction.channel.id].closed) {
            return interaction.error(`This ticket has already been closed.`, true)
        }
    
        const memData = await client.getMemberData(interaction.guild.id, mod.collection[interaction.channel.id].owner)
        memData.other.ticket = null;
        memData.markModified("other.ticket");
        await memData.save();

        mod.collection[interaction.channel.id].closed = true;
        data.guild.markModified('modules.tickets');
        await data.guild.save();

        const embed = new MessageEmbed({
            author: {
                name: `${interaction.user.username}`,
                icon_url: `${interaction.user.displayAvatarURL()}`,
            },
            description: `Ticket closed by <@!${interaction.user.id}>, it is now only viewable by staff.`,
            color: client.config.color
        })
        await interaction.reply({
            embeds: [embed], components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle(`SUCCESS`)
                            .setCustomId(`ticketcancel`)
                            .setLabel(`Open`)
                            .setEmoji(`🔓`),
                        new MessageButton()
                            .setStyle(`DANGER`)
                            .setCustomId(`ticketdelete`)
                            .setLabel(`Delete`)
                            .setEmoji(`🗑`),
                        new MessageButton()
                            .setStyle(`SECONDARY`)
                            .setCustomId(`tickettranscript`)
                            .setLabel(`Transcript`)
                            .setEmoji(`🗄`)
                    )]
        });
        const member = interaction.guild.members.cache.get(mod.collection[interaction.channel.id].owner);
        try {
            interaction.channel.permissionOverwrites.edit(member, {
                VIEW_CHANNEL: false
            });
        } catch {
        }
    }
    if (interaction.customId.startsWith('tickettranscript')) {
        if (!mod.transcriptChannel) {
            return interaction.error("There was no transcript channel for me to send the transcript to! Please set this up with the settings command!")
        } else {
            let ticketMessages = await (interaction.channel.messages.cache.toJSON())
            let msgs = "";
            try {
                ticketMessages.forEach((msg) => {
                    const attachments = [];
                    msg.attachments.forEach((attachment) => {
                        attachments.push(attachment.url)
                    })
                    msgs += `[${msg.author.username}#${msg.author.discriminator}]: ${msg.content || `${attachments.length > 0 ? `(${attachments.length} file${attachments.length === 1 ? 's' : ''}: ` + attachments.join(' | ') + ")" : '(Embeds cannot be displayed.)'}`}\n`
                })
            } catch {}
            
            const embed = new MessageEmbed()
                .setTitle(`Ticket Transcript`)
                .setURL(await WebTranscript(client, interaction, data))
                .addFields(
                    { name: `Owner`, value: `<@${(mod.collection[interaction.channel.id]).owner}>`, inline: true },
                    { name: `Channel`, value: `${interaction.channel.name}`, inline: true },
                    { name: `Created`, value: `${moment(mod.collection[interaction.channel.id].created).format('LLLL')}`, inline: true },
                    { name: `Reason`, value: `\`${mod.collection[interaction.channel.id].reason}\``, inline: true },
                )
                .setFooter({ text: `Ticket #${mod.collection[interaction.channel.id].num}`, iconURL: `${interaction.guild.iconURL()}` })
                .setColor(client.config.color)
            const file = new MessageAttachment()
                .setName("TicketTranscript")
                .setSpoiler(true)
                .setFile(Buffer.from(msgs), "TicketTranscript.txt")
    
            const transcriptChannel = await interaction.guild.channels.cache.get(mod.transcriptChannel);
            await transcriptChannel?.send({ files: [file], embeds: [embed] })
            return await interaction.success(`Transcript sent to the transcript channel.`)
        }
    }
    if (interaction.customId.startsWith('ticketdelete')) {
        try {interaction.message?.delete()} catch {}
        interaction.channel.send(`Processing messages...`).then(m => {
            setTimeout(function () {
                m.edit(`Deleting channel...`)
            }, 1000)
        })
        setTimeout(async function () {
            interaction.channel.delete();
        }, 2000)
    }
    if (interaction.customId.startsWith('ticketcancel')) {
        try {interaction.message?.delete()} catch {}

        const member = interaction.guild.members.cache.get(mod.collection[interaction.channel.id].owner);
        interaction.channel.permissionOverwrites.edit(member, {
            VIEW_CHANNEL: true
        });

        const memData = await client.getMemberData(interaction.guild.id, mod.collection[interaction.channel.id].owner)
        memData.other.ticket = { channel: interaction.channel.id }
        memData.markModified("other.ticket");
        await memData.save();

        mod.collection[interaction.channel.id].closed = false;
        data.guild.markModified('modules.tickets');
        await data.guild.save();

        const embed = new MessageEmbed()
            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setDescription(`Ticket has been re-opened by support.`)
            .setColor(client.config.color)

        return interaction.channel.send({ embeds: [embed] }).then((m) => {
            try {
                setTimeout(() => {
                    m.delete()
                }, 5000)
            } catch { }
        })
    }
    if (interaction.customId.startsWith('ticketrules')) {
        if (data.member.other.ticketrules) return interaction.error("You have already agreed to the rules!", true)
        data.member.other.ticketrules = true;
        data.member.markModified('other.ticketrules');
        await data.member.save();
        return interaction.success("You have agreed to the ticket rules and can now open a ticket.", true)
    }
}