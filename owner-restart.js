const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('whasapi');
const {
    exec
} = require('child_process');

module.exports = {
    name: 'restart',
    category: 'owner',
    code: async (sock) => {
        const handlerObj = await handler(sock, {
            owner: true
        });

        if (handlerObj.status) return sock.reply(handlerObj.message);

        try {
            await sock.reply(global.msg.wait);

            exec(`pm2 restart whabot`); // PM2
        } catch (error) {
            console.error('Error:', error);
            return sock.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};