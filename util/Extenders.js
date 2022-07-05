const { Interaction, MessageEmbed, MessageEmbedOptions, APIEmbed } = require("discord.js");

Interaction.prototype.error = function(desc, ephemeral = false) {
	return this.reply({ embeds: [(new MessageEmbed().setDescription(`${this.client.customEmojis.error} ${desc}`).setColor(this.client.config.errColor))], ephemeral })
};

Interaction.prototype.success = function(desc, ephemeral = false) {
	return this.reply({ embeds: [(new MessageEmbed().setDescription(`${this.client.customEmojis.success} ${desc}`).setColor(this.client.config.successColor))], ephemeral })
};

/**
* @param {MessageEmbed|MessageEmbedOptions|APIEmbed} [options={}] MessageEmbed to clone or raw embed data
*/
Interaction.prototype.send = function(options, ephemeral = false) {
    const embed = new MessageEmbed()
    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.color) embed.setColor(options.color); else embed.setColor(this.client.config.color);
    if (options.footer) embed.setFooter(options.footer);
    if (options.image) embed.setImage(options.image);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.author) embed.setAuthor(options.author);
    if (options.fields) embed.setFields(options.fields);
    if (options.timestamp) embed.setTimestamp();
    if (options.url) embed.setURL(options.url);

    return this.reply({ embeds: [embed], ephemeral })
}