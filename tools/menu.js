const {
    convertMsToDuration
} = require('./simple.js');
const package = require('../package.json');
const {
    bold,
    quote
} = require('whasapi');
const moment = require('moment-timezone');

/**
 * Generates a menu of available commands based on the provided command map and context.
 * @param {Object} sock The context object containing information about the current context.
 * @returns {string} The generated menu text.
 */
exports.getMenu = (sock) => {
    const commandsMap = sock._self.cmd;
    const tags = {
        'main': 'Main',
        'owner': 'Owner',
        'info': 'Info',
        '': 'No Category'
    };

    if (!commandsMap || commandsMap.size === 0) return `${bold('[ ! ]')} Terjadi kesalahan: Tidak ada perintah yang ditemukan.`;

    const sortedCategories = Object.keys(tags);

    const readmore = '\u200E'.repeat(4001);

    let text = `Hai ${sock._sender.pushName || 'Kak'}, berikut adalah daftar perintah yang tersedia!\n` +
        '\n' +
        `╭ ➤ Waktu aktif: ${convertMsToDuration(Date.now() - global.system.startTime) || 'kurang dari satu detik.'}\n` +
        `│ ➤ Tanggal: ${moment.tz(global.system.timeZone).format('DD/MM/YY')}\n` +
        `│ ➤ Waktu: ${moment.tz(global.system.timeZone).format('HH:mm:ss')}\n` +
        `│ ➤ Versi: ${package.version}\n` +
        `╰ ➤ Prefix: ${sock._used.prefix}\n` +
        '\n' +
        `${quote('Jangan lupa berdonasi agar bot tetap online!')}\n` +
        `${global.msg.readmore}\n`;

    for (const category of sortedCategories) {
        const categoryCommands = Array.from(commandsMap.values())
            .filter(command => command.category === category)
            .map(command => ({
                name: command.name,
                aliases: command.aliases
            }));

        if (categoryCommands.length > 0) {
            text += `╭─「 ${bold(tags[category])} 」\n`;

            if (category === 'main') {
                text += `│ ➤ ${categoryCommands.map(cmd => `${sock._used.prefix || '/'}${cmd.name}${cmd.aliases ? `\n│ ➤ ${cmd.aliases.map(alias => `${sock._used.prefix || '/'}${alias}`).join('\n│ ➤ ')}` : ''}`).join('\n│ ➤ ')}\n`;
            } else {
                text += `│ ➤ ${categoryCommands.map(cmd => `${sock._used.prefix || '/'}${cmd.name}`).join('\n│ ➤ ')}\n`;
            }

            text += `╰────\n\n`;
        }
    };

    text += global.msg.footer;

    return text;
}