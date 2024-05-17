const smpl = require('./tools/simple.js');

/**
 * Handles requests based on the given options.
 * @param {Object} sock The context of the request.
 * @param {Object} options The given options.
 * @returns {Object} Object containing status and message if applicable, otherwise null.
 */
exports.handler = async (sock, options) => {
    const senderNumber = sock._sender.jid.split('@')[0];
    const msg = global.msg;

    const checkOptions = {
        admin: {
            function: async () => await smpl.isAdmin(sock) === 0,
            msg: msg.admin
        },
        banned: {
            function: async () => await global.db.get(`user.${senderNumber}.isBanned`),
            msg: msg.banned
        },
        botAdmin: {
            function: async () => await smpl.isAdminOf(sock) === 0,
            msg: msg.botAdmin
        },
        group: {
            function: async () => !sock.isGroup(),
            msg: msg.group
        },
        owner: {
            function: async () => await smpl.isOwner(senderNumber) === 0,
            msg: msg.owner
        },
        private: {
            function: async () => sock.isGroup(),
            msg: msg.private
        }
    };

    try {
        for (const option of Object.keys(options)) {
            const checkOption = checkOptions[option];
            if (await checkOption.function()) {
                return {
                    status: true,
                    message: checkOption.msg
                };
            }
        }
    } catch (error) {
        console.error('Error', error);
        return {
            status: false,
            message: 'An error occurred while processing the request.'
        };
    }
 
    return {
        status: false,
        message: null
    };
}