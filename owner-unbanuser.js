const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('whasapi');

module.exports = {
    name: 'unban',
    aliases: ['unbanuser'],
    category: 'owner',
    code: async (sock) => {
        const handlerObj = await handler(sock, {
            owner: true
        });

        if (handlerObj.status) return sock.reply(handlerObj.message);

        const input = sock._args.join(' ');

        const mentionedJids = sock._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const inputUser = `${input}@s.whatsapp.net`;
        const user = mentionedJids[0] || inputUser || null;

        if (!user) return sock.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${sock._used.prefix + sock._used.command} @${sock._client.user.id.split(':')[0]}`)}`,
            mentions: sock.getMentioned()
        });

        try {
            if (user === sock._sender.jid) throw new Error('Tidak dapat digunakan pada diri Anda sendiri.');

            await global.db.set(`user.${user.split('@')[0]}.isBanned`, false);

            sock.sendMessage(user, {
                text: 'Anda telah diunbanned oleh Owner!'
            });
            sock.reply(`${bold('[ ! ]')} Berhasil diunbanned!`);
        } catch (error) {
            console.error('Error:', error);
            return sock.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};