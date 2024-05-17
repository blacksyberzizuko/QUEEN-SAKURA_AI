const {
    handler
} = require('../handler.js');
const {
    convertMsToDuration
} = require('../tools/simple.js');

module.exports = {
    name: 'runtime',
    category: 'info',
    code: async (sock) => {
        const handlerObj = await handler(sock, {
            banned: true
        });

        if (handlerObj.status) return sock.reply(handlerObj.message);

        const startTime = global.system.startTime;
        return sock.reply(`Bot telah aktif selama ${convertMsToDuration(Date.now() - startTime) || 'kurang dari satu detik.'}.`);
    }
};