const { TextInputComponent, Modal, MessageActionRow } = require('discord.js');

module.exports = async (client, interaction, data) => {
    const modal = new Modal()
        .setCustomId("autorole-settings")
        .setTitle(`Autorole Settings`)
        .setComponents(
            new MessageActionRow({
                components: [
                    new TextInputComponent()
                        .setCustomId('arenabled')
                        .setLabel(`Enabled`)
                        .setStyle('SHORT')
                        .setMinLength(1)
                        .setMaxLength(5)
                        .setPlaceholder(`Must be true or false. Current: ${data.guild.modules.autorole.enabled ? 'true' : 'false'}`)
                        .setRequired(true)
            ]}),
            new MessageActionRow({
                components: [
                    new TextInputComponent()
                        .setCustomId('arrole')
                        .setLabel(`Role`)
                        .setStyle('SHORT')
                        .setMinLength(1)
                        .setMaxLength(100)
                        .setPlaceholder(`Role ID. Current: ${data.guild.modules.autorole.role ? data.guild.modules.autorole.role : 'None'}`)
                        .setRequired(false)
            ]})
        )

    await interaction.showModal(modal)

    const submitted = await interaction.awaitModalSubmit({ time: 60000, filter: i => i.user.id === interaction.user.id}).catch(error => {
        return null
    })

    if (submitted) {
        await submitted.deferReply({ ephemeral: true }).catch((e) => {})
        const enabled = submitted.fields.getTextInputValue('arenabled');
        const role = submitted.fields.getTextInputValue('arrole');

        if (!["true", "false"].includes(enabled.toLowerCase())) return await submitted.followUp(`Enabled must be true or false.`)
        if (enabled === "true" && !role) return await submitted.followUp(`You must provide a role if you want to enable autorole.`)
        if (enabled === "true" && !await client.resolveRole(interaction.guild.id, role)) return await submitted.followUp(`Role not found.`)
        if (enabled === "true" && !role.editable) return await submitted.followUp(`I do not have permission to assign this role.`)

        enabled === "true" ? data.guild.modules.autorole.enabled = true : data.guild.modules.autorole.enabled = false;
        enabled === "true" ? data.guild.modules.autorole.role = role : data.guild.modules.autorole.role = null;

        data.guild.markModified('modules.autorole');
        await data.guild.save();

        await submitted.followUp(`Autorole settings updated.`)
    } else {
        await submitted.followUp(`You took too long to respond.`)
    }
}