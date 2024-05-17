const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('whasapi');
const {
    spawn
} = require('child_process');

module.exports = {
    name: 'js',
    aliases: ['javascript'],
    category: 'tools',
    code: async (sock) => {
        const handlerObj = await handler(sock, {
            banned: true
        });

        if (handlerObj.status) return sock.reply(handlerObj.message);

        const input = sock._args.join(' ');
        const script = input;

        if (!script) return sock.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${sock._used.prefix + sock._used.command} console.log('Hello World!');`)}`
        );

        try {
            const restricted = ['require', 'eval', 'Function', 'global'];
            for (const w of restricted) {
                if (script.includes(w)) {
                    throw new Error(`Penggunaan ${w} tidak diperbolehkan dalam kode.`);
                }
            }

            const output = await new Promise((resolve) => {
                const childProcess = spawn('node', ['-e', script]);

                let result = '';

                childProcess.stdout.on('data', (data) => {
                    result += data.toString();
                });

                childProcess.stderr.on('data', (data) => {
                    throw new Error(data.toString());
                });

                childProcess.on('close', (code) => {
                    if (code !== 0) {
                        throw new Error(`Keluar dari proses dengan kode: ${code}`);
                    } else {
                        resolve(result);
                    }
                });

                setTimeout(() => {
                    childProcess.kill();
                    throw new Error('Kode mencapai batas waktu proses.');
                }, 10000);
            });

            sock.reply(output.trim());
        } catch (error) {
            console.error('Error:', error);
            return sock.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};