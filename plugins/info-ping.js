module.exports = {
    name: 'ping',
    category: 'info',
    code: async (sock) => {
        return sock.reply('Pong!');
    }
};