const perms = require('../assets/perms.js');

module.exports = async (interaction, command) => {
    if (command.perms) {
        if (!interaction.member.permissions.has(command.perms)) {
            await interaction.error(`You do not have permission to use this command.`);
            return false;
        } else return true;
    } else {
        if (command.category === 'developer') {
            if (!perms['developer'].includes(interaction.member.id)) {
                await interaction.error(`You do not have permission to use this command.`);
                return false;
            } else return true;
        }
        const permission = perms[command.category];
        if (permission) {
            if (!interaction.member.permissions.has(permission)) {
                await interaction.error(`You do not have permission to use this command.`);
                return false;
            } else return true;
        } else return true;
    }
}