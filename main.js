const smpl = require('./tools/simple.js');
const {
    bold,
    Client,
    CommandHandler
} = require('whasapi');
const {
    Events,
    MessageType
} = require('whasapi/lib/Constant');
const fg = require('api-dylux');
const {
    exec
} = require('child_process');
const path = require('path');
const SimplDB = require('simpl.db');
const {
    inspect
} = require('util');

console.log('Connecting...');

// Create a new bot instance.
const bot = new Client({
    name: global.bot.name,
    prefix: global.bot.prefix,
    printQRInTerminal: true,
    readIncommingMsg: true
});

// Create a new database instance.
const db = new SimplDB();
global.db = db;

// Event handling when the bot is ready.
bot.ev.once(Events.ClientReady, (m) => {
    console.log(`Ready at ${m.user.id}`);
    global.system.startTime = Date.now();
});

// Handle uncaughtExceptions.
process.on('uncaughtException', (err) => console.error(err));

// Create command handlers and load plugins.
const cmd = new CommandHandler(bot, path.resolve(__dirname, 'plugins'));
cmd.load();

// Event handling when the message appears.
bot.ev.on(Events.MessagesUpsert, async (m, sock) => {
    const senderNumber = sock._sender.jid.split('@')[0];
    const senderJid = sock._sender.jid;
    const groupNumber = m.key.remoteJid.split('@')[0];
    const groupJid = m.key.remoteJid;

    // All chat types.
    if (m.key.fromMe) return; // Checking messages.

    if (smpl.isCmd(m, sock)) sock.simulateTyping(); // Auto-typing,

    // Owner-only.
    if (smpl.isOwner(senderNumber) === 1) {
        // Eval.
        if (m.content && m.content.startsWith && (m.content.startsWith('> ') || m.content.startsWith('>> '))) {
            const code = m.content.slice(2);

            try {
                const result = await eval(m.content.startsWith('>> ') ? `(async () => { ${code} })()` : code);

                return await sock.reply(inspect(result));
            } catch (error) {
                console.error('Error:', error);
                return sock.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
            }
        }

        // Exec.
        if (m.content && m.content.startsWith && m.content.startsWith('$ ')) {
            const command = m.content.slice(2);

            const output = await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(new Error(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`));
                    } else if (stderr) {
                        reject(new Error(stderr));
                    } else {
                        resolve(stdout);
                    }
                });
            });

            return await sock.reply(output);
        }
    }

    // Group.
    if (sock.isGroup) {
        if (db.get(`group.${groupNumber}.antilink`)) {
            const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;

            if (m.message && m.message.extendedTextMessage && (m.message.extendedTextMessage.inviteLinkGroupTypeV2 || urlRegex.test(m.content))) {
                sock.deleteMessage(m.key);
                /* If you want automatic kick, use this.
                await sock._client.groupParticipantsUpdate(sock.id, [senderNumber], 'remove'); */

                return sock.reply('Jangan kirim tautan!');
            }
        }
    }


    // Private.
    if (!sock.isGroup) {}
});

bot.ev.once(Events.UserJoin, async (m) => {
    const {
        id,
        participants
    } = m;

    try {
        const metadata = await bot.core.groupMetadata(id);

        // Participants.
        for (const jid of participants) {
            // Get profile picture user.
            let profile;
            try {
                profile = await bot.core.profilePictureUrl(jid, 'image');
            } catch {
                const thumbnail = await fg.googleImage('Whatsapp wallpaper');
                profile = smpl.getRandomElement(thumbnail);
            }

            if (!db.get(`group.${id.split('@')[0]}.welcome`)) return;
            bot.core.sendMessage(id, {
                text: `Selamat datang @${jid.split('@')[0]} di grup ${metadata.subject}!`,
                contextInfo: {
                    mentionedJid: [jid],
                    externalAdReply: {
                        title: `ADD`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: profile,
                        sourceUrl: global.bot.groupChat
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return bot.core.sendMessage(id, {
            text: `${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`
        });
    }
});

bot.ev.once(Events.UserLeave, async (m) => {
    const {
        id,
        participants
    } = m;

    try {
        const metadata = await bot.core.groupMetadata(id);

        // Participants.
        for (const jid of participants) {
            // Get profile picture user.
            let profile;
            try {
                profile = await bot.core.profilePictureUrl(jid, 'image');
            } catch {
                const thumbnail = await fg.googleImage('Whatsapp wallpaper');
                profile = smpl.getRandomElement(thumbnail);
            }

            if (!db.get(`group.${id.split('@')[0]}.welcome`)) return;
            bot.core.sendMessage(id, {
                text: `@${jid.split('@')[0]} keluar dari grup ${metadata.subject}.`,
                contextInfo: {
                    mentionedJid: [jid],
                    externalAdReply: {
                        title: `REMOVE`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: profile,
                        sourceUrl: global.bot.groupChat
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return bot.core.sendMessage(id, {
            text: `${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`
        });
    }
});

// Launching bot.
bot.launch().catch((error) => console.error('Error:', error));