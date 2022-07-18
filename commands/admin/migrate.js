module.exports = {
    name: "migrate",
    description: "Migrate users to a new server.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "role",
            description: "The role to migrate to.",
            type: "ROLE",
        }
    ],
    
    run: async (client, interaction, args, data) => {
        /* brb
        const __dirname = path.resolve(path.dirname(''));
        const tokens = JSON.parse(fs.readFileSync(__dirname + '/storage/tokens.json'));
        const role = args[0];
    
        await interaction.reply({ content: 'Adding members...', ephemeral: true });
    
        let added = 0;
    
        const updater = setInterval(() => {
          interaction.editReply({ content:
            `Added ${added}/${tokens.length} members **[${progressBar(
              added,
              0,
              tokens.length
            )}]**`
            , ephemeral: true });
        }, 10000);
    
        for (let token of tokens) {
          try {
            await client.OAuth2Client.addMember({
              accessToken: token.access_token,
              botToken: client.config.token,
              guildId: interaction.guild.id,
              userId: token.id
            });
            if (role) await interaction.guild.members.cache.get(token.id).roles.add(role);
          } catch {
            try {
              let _ = await client.OAuth2Client.tokenRequest({
                scope: 'guilds.join',
                grantType: 'refresh_token',
                refreshToken: token.refresh_token
              });
              token.access_token = _.access_token;
              token.refresh_token = _.refresh_token;
              await client.OAuth2Client.addMember({
                accessToken: _.access_token,
                botToken: client.config.token,
                guildId: interaction.guild.id,
                userId: token.id
              });
              if (role) await interaction.guild.members.cache.get(token.id).roles.add(role);
            } catch {}
          }
    
          added++;
          // Rate limit prevention
          await new Promise((_) => setTimeout(_, 2500));
        }
    
        fs.writeFile(__dirname + '/storage/tokens.json', JSON.stringify(tokens, null, 2), (err, result) => {
          if (err) {
              console.log(err)
              interaction.editReply({ content: "An error occurred saving new refresh/access tokens. Please check console for errors.", ephemeral: true });
          } else {
            interaction.editReply({ content: 'File writing complete!', ephemeral: true });
          }
      });
    
        clearInterval(updater);
        interaction.editReply(`${tokens.length} members migrated to this server.`);
        */
    },
};

function progressBar(val, start, end, inc = 10, fill = '⬜', unfill = '⬛') {
    let out = '';
    for (let i = start; i < end; i += (end - start) / inc) {
      out += val > i ? fill : unfill;
    }
    return out;
  }