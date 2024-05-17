const package = require('./package.json');
const {
    bold,
    quote
} = require('whasapi');


// Bot.
global.bot = {
    name: 'whabot',
    prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i,
    thumbnail: 'https://telegra.ph/file/eac11a49981dd882d1f8c.png',
    groupChat: 'https://chat.whatsapp.com/HpzMY6wHM2GBgIXNQyVpga'
};

// MSG (Message).
global.msg = {
    // Command access.
    admin: `${bold('[ ! ]')} Perintah hanya dapat diakses oleh admin grup!`,
    banned: `${bold('[ ! ]')} Tidak dapat memproses karena Anda telah dibanned!`,
    botAdmin: `${bold('[ ! ]')} Bot bukan admin, tidak bisa menggunakan perintah!`,
    owner: `${bold('[ ! ]')} Perintah hanya dapat diakses Owner!`,
    group: `${bold('[ ! ]')} Perintah hanya dapat diakses dalam grup!`,
    private: `${bold('[ ! ]')} Perintah hanya dapat diakses dalam obrolan pribadi!`,

    // Command interface.
    watermark: `${package.name}@^${package.version}`,
    footer: quote('Dibuat oleh KazeDevID | Menggunakan library whasapi.'),
    readmore: '\u200E'.repeat(4001),

    // Command process.
    argument: `${bold('[ ! ]')} Masukkan argumen!`,
    wait: `${bold('[ ! ]')} Tunggu sebentar...`,

    // Command process (Error).
    notFound: `Tidak ada yang ditemukan!`,
    urlInvalid: `URL tidak valid!`
};

// Owner.
global.owner = {
    name: 'Kaze',
    number: '6282217590187',
    organization: 'WarKop BangDev'
};

// Sticker.
global.sticker = {
    packname: '\n\n\n\n',
    author: 'whabot - Kaze'
};

// System.
global.system = {
    startTime: null,
    timeZone: 'Asia/Jakarta'
};
