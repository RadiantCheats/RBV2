const { Collection } = require("discord.js");
const fs = require("fs");

module.exports = async (client, interaction, data) => {
    const ticket = data.guild.modules.tickets.collection[interaction.channel.id];

    let messageCollection = new Collection();
    let channelMessages = await interaction.channel.messages.fetch({
        limit: 100
    })
    messageCollection = messageCollection.concat(channelMessages);

    while (channelMessages.size === 100) {
        channelMessages = await interaction.channel.messages.fetch({ limit: 100, before: await channelMessages.lastKey() })
        if (channelMessages) messageCollection = messageCollection.concat(channelMessages);
    }
    let ticketMessages;
    messageCollection.map((a, b, c) => { 
        ticketMessages = c
        ticketMessages.reverse();
    })

    Promise.all(
        ticketMessages.map(async msg => {
            return new Promise(async (resolve, reject) => {
                msg.fields = await ticketMessages;
                resolve();
            })
        })
    )

    let messages = [];
    const discordData = {};

    ticketMessages.forEach((message) => {
        let roles;
        if (message.member === null) {
            roles = "";
        } else {
            roles = message.member.roles.cache;
        }
        const channels = message.guild.channels.cache;

        if (!discordData[message.author.id]) {
            discordData[message.author.id] = {
                "name": message.author.username,
                "tag": message.author.discriminator,
                "nick": message.author.username,
                "avatar": message.author.displayAvatarURL().split('/')[5].split('.')[0] || ''
            }
        }
        try {
            roles.forEach((role) => {
                if (!discordData[role.id]) {
                    discordData[role.id] = {
                        "name": role.name
                    }
                }
            })
            channels.forEach((channel) => {
                if (!discordData[channel.id]) {
                    discordData[channel.id] = {
                        "name": channel.name
                    }
                }
            })
        } catch { }

        const val = {
            discordData,
            "bot": message.author.bot,
            "username": message.author.username,
            "nick": message.author.username,
            "tag": message.author.discriminator,
            "avatar": message.author.displayAvatarURL().split('/')[5].split('.')[0] || '',
            "user_id": message.author.id,
            "id": message.id,
            "created": message.createdTimestamp,
            "edited": message.editedTimestamp ? message.editTimestamp : null,
        };

        if (message.mentions.repliedUser) {
            val.reference = {
                "channel": message.reference.channelId,
                "server": message.reference.guildId,
                "message": message.reference.messageId
            }
        }

        if (message.content) {
            val.content = message.content;
        }

        if (message.embeds[0]) {
            val.embeds = []
            message.embeds.forEach((embed) => {
                const { description, footer, title, color, author, fields } = embed
                const final = {};

                const check_n_set = (variable, value) => {
                    if (embed[variable]) {
                        final[variable] = value
                    }
                }

                check_n_set('title', title)
                check_n_set('description', description)
                check_n_set('color', color?.toString(16))
                check_n_set('footer', footer)
                check_n_set('author', author)
                check_n_set('fields', fields)

                val.embeds.push(final)
            })
        }

        message.attachmentsCollection = message.attachments;
        message.attachments = [];

        message.attachmentsCollection.map((a, b, c) => { message.attachments.push(a) })

        if (message.attachments[0]) {
            val.attachments = [];
            message.attachments.forEach((file) => {
                val.attachments.push(file)
            })
        }

        messages.push(val)
    })

    messages = JSON.stringify(messages)

    let icon = interaction.guild.iconURL();
    icon = icon.split('/')[5].split('.')[0]

    const html =
    `<!-- 
    Transcript For Ticket: ${interaction.channel.name}
    Ticket ID: ${ticket.num}
    Opened on: ${`${ticket.created}`.slice(0, 10)}
    -->

    <Server-Info>
    Server: ${interaction.guild.name} (${interaction.channel.id})
    Channel: ${interaction.channel.name} (${interaction.channel.id})

    <Base-Transcript>
    <script src="https://pastebin.com/raw/4zxQ3hKQ"></script>
    <script type="text/javascript">
    let channel = {
        "name": "${interaction.channel.name}",
        "id": "${interaction.channel.id}"
    };
    let server = {
        "name": "${interaction.guild.name}",
        "id": "${interaction.guild.id}",
        "icon": "${icon}"
    };
    let messages = ${messages}
    window.Convert(messages, channel, server)
    </script>`;

    fs.appendFileSync('./storage/transcripts/' + ticket.num + '.html', html)

    return `https://bot.radiantcheats.net/transcript/${interaction.channel.id}`;
}