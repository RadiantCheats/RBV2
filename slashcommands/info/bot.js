const { MessageEmbed } = require('discord.js');
const { mem, cpu } = require('node-os-utils');
const botInfo = require('../../package.json');

module.exports = {
    name: "bot",
    description: "Shows info about the bot.",
    type: 'CHAT_INPUT',
    options: [],
    
    run: async (client, interaction, args, data) => {
        const { totalMemMb, usedMemMb, freeMemMb } = await mem.info();

        const uptime = await parseDur(client.uptime);

        const clientembed = new MessageEmbed()
            .setTitle(`Hi, it's me, RadiantBot!`)
            .setColor(client.config.color)
            .setTimestamp(interaction.createdAt)
            .addFields(
                { name: "Development version", value: "v" + botInfo.version, inline: false },
                { name: "Developers", value: `<@611978487066263582> + <@759156960775110666>`, inline: false },
                { name: "Node.js version: ", value: process.version, inline: true },
                { name: "Discord.js version: ", value: botInfo.dependencies['discord.js'].replace('^', 'v'), inline: true },
                { name: "Current Uptime: ", value: `${uptime}`, inline: true },
                { name: "\u200b", value: "```System Specifications```\n", inline: false },
                { name: "CPU Model", value: `${cpu.model()}`, inline: true },
                { name: 'CPU Cores', value: `${cpu.count()}`, inline: true },
                { name: 'CPU Usage', value: `${await cpu.usage()}%`, inline: true },
                { name: 'RAM Total', value: `${totalMemMb}MB`, inline: true },
                { name: 'RAM Free', value: `${freeMemMb}MB`, inline: true },
                { name: 'RAM Usage', value: `${usedMemMb}MB`, inline: true },
            )
        return interaction.reply({ embeds: [clientembed] })
    },
};

async function parseDur(ms) {
	let seconds = ms / 1000;

	const days = parseInt(seconds / 86400);
	seconds = seconds % 86400;

	const hours = parseInt(seconds / 3600);
	seconds = seconds % 3600;

	const minutes = parseInt(seconds / 60);
	seconds = parseInt(seconds % 60);

	if (days) {
		return `${days} days, ${hours} hours, ${minutes} minutes`;
	}
	else if (hours) {
		return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
	}
	else if (minutes) {
		return `${minutes} minutes, ${seconds} seconds`;
	}
	return `${seconds} seconds`;
}