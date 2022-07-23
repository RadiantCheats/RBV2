const { TextInputComponent, Modal, MessageActionRow, SelectMenuInteraction } = require('discord.js');

module.exports = async (client, interaction, data) => {
    const modal = new Modal()
        .setCustomId("ticket-settings")
        .setTitle(`Tickets Settings`)
        .setComponents(
            new MessageActionRow({
                components: [
                    new TextInputComponent()
                        .setCustomId('module_toggle')
                        .setLabel(`Module`)
                        .setStyle('SHORT')
                        .setMinLength(1)
                        .setMaxLength(25)
                        .setPlaceholder(`Check /logs for all avaliable options`)
                ]
            }),
        )

    await interaction.showModal(modal)

    const submitted = await interaction.awaitModalSubmit({ time: 60000, filter: i => i.user.id === interaction.user.id }).catch(error => {
        return null
    })

    if (submitted) {
        // await submitted.deferReply({ ephemeral: true }).catch((e) => { })
        // const role = submitted.fields.getTextInputValue('tsstaff');
        // const category = submitted.fields.getTextInputValue('tscategory');
        // const channel = submitted.fields.getTextInputValue('tstranscriptchannel');

        // if (role && !await client.resolveRole(interaction.guild.id, role)) return await submitted.followUp(`I could not find the role you provided.`)
        // if (category && !await client.resolveChannel(interaction.guild.id, category)) return await submitted.followUp(`I could not find the category you provided.`)
        // if (channel && !await client.resolveChannel(interaction.guild.id, channel)) return await submitted.followUp(`I could not find the channel you provided.`)

        // if (role) data.guild.modules.tickets.staff = role;
        // if (category) data.guild.modules.tickets.category = category;
        // if (channel) data.guild.modules.tickets.transcriptChannel = channel;
        // data.guild.markModified("modules.tickets");
        // await data.guild.save();

        // await submitted.followUp(`Tickets settings updated.`)
    } else {
        await submitted.reply(`You took too long to respond.`)
    }
}