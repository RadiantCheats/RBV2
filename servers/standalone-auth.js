const express = require('express');
const fs = require('fs');
const DiscordOAuth2 = require('discord-oauth2');

module.exports = async (client) => {
    const app = express();
    const OAuth2Client = new DiscordOAuth2({
        clientId: client?.user?.id || client.config.clientId,
        clientSecret: process.env.CLIENT_SECRET || client.config.clientSecret,
        redirectUri: client.config.baseUrl + 'api/auth',
    });

    app.get('/api/auth', async function(req, res) {
        if (!req.query.code) return res.send('No code provided.');

        //const tokens = JSON.parse(fs.readFileSync('./storage/tokens.json'));

        const server = client.config.guildId;
        const verifiedRole = (((await client.getGuildData(server)).modules.autorole.role) || client.config.verifiedRole);
    
        const data = await OAuth2Client.tokenRequest({
            code: req.query.code,
            scope: ['guilds.join', 'identify'],
            grantType: 'authorization_code',
            redirectUri: client.config.baseUrl + 'api/auth',
            guild: server
        });
      
        const user = await OAuth2Client.getUser(data.access_token);
        //if (tokens.some((t) => t.id == user.id)) return res.send("You have already authenticated.")

        let output = [{
            id: user.id,
            access_token: data.access_token,
            expires_in: data.expires_in,
            refresh_token: data.refresh_token,
        }];

        await OAuth2Client.addMember({
            accessToken: data.access_token,
            botToken: process.env.TOKEN,
            guildId: server,
            userId: user.id,
            roles: [verifiedRole],
        })

        fs.readFile('./storage/tokens.json', (err, data) => {
            var data = JSON.parse(data);
            data.push(...output);
            var writeData = fs.writeFile('./storage/tokens.json', JSON.stringify(data, null, 2), (err, result) => {
            if (err) return res.send("An error occurred."); else return res.redirect(client.config.authRedirect);
            });
        });
    });

    app.get('*', (req, res) => {
        return res.redirect(OAuth2Client.generateAuthUrl({ scope: ['guilds.join', 'identify'] }));
    })

    app.listen(client.config.authPort, () => {
        console.log(`Authentication server is listening on port ${client.config.authPort}`);
    })
}