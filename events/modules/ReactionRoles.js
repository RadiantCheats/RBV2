module.exports = (client, data, add, reaction, user) => {
    if (user.bot) return;

    const emojis = data.guild.reactionroles.roles.filter(o => o?.emoji);
    console.log(emojis);
    let roles = db.get('reaction_roles.roles');
    let emoji2;
    roles.forEach((r, i) => {
        const emoji = reaction._emoji
        if (reaction._emoji.id) {
            if (emojis[i] === `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`) {
                emoji2 = roles[i]
            }
        } else {
            if (emojis[i] === reaction._emoji.name) {
                emoji2 = roles[i]
            }
        }
    })
    const guild = reaction.message.guild
    const user2 = guild.members.cache.get(user.id)
    add ?
        user2.roles.add(guild.roles.cache.get(emoji2)) :
        user2.roles.remove(guild.roles.cache.get(emoji2));
}