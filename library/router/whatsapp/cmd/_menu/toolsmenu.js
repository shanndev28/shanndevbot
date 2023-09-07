const { listCommands } = require('@router/builder/cmd')

module.exports = {
    callback: async ({ msg, prefix, command }) => {
        let text = `*ᴛᴏᴏʟꜱᴍᴇɴᴜ*`
        for (var i of listCommands['Tools']) {
            text += `\n⦿ ${prefix + i}`
        }

        return msg.reply(text)
    }
}