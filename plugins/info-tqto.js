const {
    handler
} = require('../handler.js');
const {
    bold
} = require('whasapi');

module.exports = {
    name: 'tqto',
    aliases: ['thanksto'],
    category: 'info',
    code: async (sock) => {
        const handlerObj = await handler(sock, {
            banned: true
        });

        if (handlerObj.status) return sock.reply(handlerObj.message);

        return sock.reply(
            `❖ ${bold('TQTO')}\n` +
            '\n' +
            '➤ Baileys\n' +
            '➤ Kaze(Me) (https://github.com/KazeDevID)\n' +
            '➤ Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.\n' +
            '\n' +
            global.msg.footer
        );
    }
};