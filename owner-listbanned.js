const {
    handler
} = require('../handler.js');
const {
    bold
} = require('whasapi');

module.exports = {
    name: 'listbanned',
    aliases: ['listban'],
    category: 'owner',
    code: async (sock) => {
        const handlerObj = await handler(sock, {
            owner: true
        });

        if (handlerObj.status) return sock.reply(handlerObj.message);

        try {
            const databaseJSON = JSON.stringify(global.db);
            const parsedDB = JSON.parse(databaseJSON);
            const users = parsedDB.user;
            const bannedUsers = [];

            for (const userId in users) {
                if (users[userId].isBanned === true) bannedUsers.push(userId);
            }

            let resultText = '';
            let userMentions = [];

            bannedUsers.forEach(userId => {
                resultText += `➤ @${userId}\n`;
            });

            bannedUsers.forEach(userId => {
                userMentions.push(`${userId}@s.whatsapp.net`);
            });

            return sock.reply({
                text: `❖ ${bold('List Banned')}\n` +
                    '\n' +
                    `${resultText}` +
                    '\n' +
                    global.msg.footer,
                mentions: userMentions
            });
        } catch (error) {
            console.error('Error:', error);
            return sock.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};