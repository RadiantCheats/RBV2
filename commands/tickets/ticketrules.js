const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ticketrules',
    description: 'Send the ticket rules.',
    type: 'CHAT_INPUT',
    perms: ['MANAGE_GUILD'],
    options: [],

    run: async (client, interaction, args, data) =>  {
        const mod = data.guild.modules.tickets;

        mod.rules.enabled = true;
        mod.rules.channel = interaction.channel.id;
        data.guild.markModified('modules.tickets.rules');
        await data.guild.save();
        
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`ticketrules`)
                .setLabel('I accept and agree to these rules.')
                .setEmoji('✅')
                .setStyle('PRIMARY')
        );

    const embed = new MessageEmbed({
        title: `Ticket Rules`,
        description: `
1️⃣ Common questions. Common and simple questions (example: 'Does this menu have X feature?') must always be asked in help-chat before creating a ticket. You may only create a ticket if you receive no response at least 10 minutes after asking the question. For activation guides, key retrieval, menu open keys and menu websites, refer to the faq channel.

2️⃣ Pinging. In your ticket, do not ping any staff members other than the one currently assisting you. If necessary, the staff member currently assisting you will ping the relevant higher ranking staff member regarding your inquiry. Do not ping them yourself. They will reply as soon as they can, and pinging them more will not speed up the process or make them reply faster.

3️⃣ Abuse. Any abuse of our ticket system (such as: creating a ticket and instantly closing it) will not be tolerated.

4️⃣ If you have a ticket open, do not go to help-chat or our website's live chat system if you do not receive a response. If the staff member previously assisting you has not responded for over 60 minutes, you may ping them once and only once to get their attention.

5️⃣ In your ticket creation reason, make sure to include as much detail as possible. Having little to no helpful information in your ticket creation reason may result in your ticket being dismissed instantly.

6️⃣ Do not create a ticket if you are not going to reply. It is a waste of time for our staff.

**Failure to adhere to these rules may result in your support privileges being temporarily or even permanently restricted.**
        `,
        color: client.config.color,
        footer: {
            text: 'By using our ticket service, you automatically accept these rules and agree to any punishments you get.',
            icon_url: interaction.guild.iconURL()
        }
    })

        await interaction.channel.send({
            ephemeral: true,
            embeds: [embed],
            components: [row]
        })
    }
}