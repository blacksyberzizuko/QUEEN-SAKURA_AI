const {
    bold,
    VCardBuilder
} = require('whasapi');

module.exports = {
    name: 'owner',
    aliases: ['creator', 'developer', 'pemilik'],
    category: 'info',
    code: async (sock) => {
        const vcard = new VCardBuilder()
            .setFullName(global.owner.name)
            .setOrg(global.owner.organization)
            .setNumber(global.owner.number)
            .build();

        return await sock.reply({
            contacts: {
                displayName: global.owner.name,
                contacts: [{
                    vcard
                }]
            }
        });
    }
};