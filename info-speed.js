const {
    handler
} = require('../handler.js');
const {
    bold
} = require('whasapi');
const {
    performance
} = require('perf_hooks');

module.exports = {
    name: 'speed',
    category: 'info',
    code: async (sock) => {
        const handlerObj = await handler(sock, {
            banned: true
        });

        if (handlerObj.status) return sock.reply(handlerObj.message);

        try {
            const pOld = performance.now();
            const res = await sock.reply('Menguji kecepatan...');
            const speed = (performance.now() - pOld).toFixed(2);
            return sock.editMessage(res.key, `Merespon dalam ${speed} ms.`);
        } catch (error) {
            console.error('Error:', error);
            return sock.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};