const package = require('../package.json');
const {
    getMenu
} = require('../tools/menu.js');
const {
    getRandomElement
} = require('../tools/simple.js');
const {
    bold
} = require('whasapi');
const fg = require('api-dylux');

module.exports = {
    name: 'menu',
    aliases: ['help', '?'],
    category: 'main',
    code: async (sock) => {
        try {
            const text = await getMenu(sock);

            return sock.sendMessage(sock.id, {
                text: text,
                contextInfo: {
                    externalAdReply: {
                        title: global.msg.watermark,
                        body: null,
                        thumbnailUrl: global.bot.thumbnail,
                        sourceUrl: global.bot.groupChat,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, {
                quoted: sock._msg
            });
        } catch (error) {
            console.error('Error:', error);
            return sock.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};