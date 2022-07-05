const { TextInputComponent, Modal, MessageActionRow } = require('discord.js');

module.exports = async (client, interaction, data) => {
    const modal = new Modal()
        .setCustomId("ticket-settings")
        .setTitle(`Tickets Settings`)
        .setComponents(
            new MessageActionRow({
                components: [
                    new TextInputComponent()
                        .setCustomId('tsstaff')
                        .setLabel(`Staff Role`)
                        .setStyle('SHORT')
                        .setMinLength(1)
                        .setMaxLength(100)
                        .setPlaceholder(`Role ID | Current: ${data.guild.modules.tickets.staffRole ? (await client.resolveRole(interaction.guild.id, data.guild.modules.tickets.staffRole)).name : 'None'}`)
                        .setRequired(true)
            ]}),
            new MessageActionRow({
                components: [
                    new TextInputComponent()
                        .setCustomId('tscategory')
                        .setLabel(`Tickets Category`)
                        .setStyle('SHORT')
                        .setMinLength(1)
                        .setMaxLength(100)
                        .setPlaceholder(`Category ID | Current: ${data.guild.modules.tickets.category ? (await client.resolveChannel(interaction.guild.id, data.guild.modules.tickets.category)).name : 'None'}`)
                        .setRequired(true)
            ]}),
            new MessageActionRow({
                components: [
                    new TextInputComponent()
                        .setCustomId('tstranscriptchannel')
                        .setLabel(`Transcript Channel`)
                        .setStyle('SHORT')
                        .setMinLength(1)
                        .setMaxLength(100)
                        .setPlaceholder(`Transcripts Channel ID | Current: ${data.guild.modules.tickets.transcriptChannel ? (await client.resolveChannel(interaction.guild.id, data.guild)).name : 'None'}`)
                        .setRequired(false)
            ]})
        )

    await interaction.showModal(modal)

    const submitted = await interaction.awaitModalSubmit({ time: 60000, filter: i => i.user.id === interaction.user.id}).catch(error => {
        return null
    })

    if (submitted) {
        await submitted.deferReply({ ephemeral: true }).catch((e) => {})
        const role = submitted.fields.getTextInputValue('tsstaff');
        const category = submitted.fields.getTextInputValue('tscategory');
        const channel = submitted.fields.getTextInputValue('tstranscriptchannel');

        if (!await client.resolveRole(interaction.guild.id, role)) return await submitted.followUp(`I could not find the role you provided.`)
        if (!await client.resolveChannel(interaction.guild.id, category)) return await submitted.followUp(`I could not find the category you provided.`)
        if (channel && !await client.resolveChannel(interaction.guild.id, channel)) return await submitted.followUp(`I could not find the channel you provided.`)

        data.guild.modules.tickets.staff = role;
        data.guild.modules.tickets.category = category;
        data.guild.modules.tickets.transcriptChannel ? data.guild.modules.tickets.transcriptChannel = channel : data.guild.modules.tickets.transcriptChannel = null;
        data.guild.markModified("modules.tickets");
        await data.guild.save();

        await submitted.followUp(`Tickets settings updated.`)
    } else {
        await submitted.followUp(`You took too long to respond.`)
    }
}