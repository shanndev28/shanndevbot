const fs = require('fs')
const { lolhuman } = require('@router/myfunc')

module.exports = {
    wait: true,
    category: 'Tools',
    callback: async ({ msg, prefix, command }) => {
        if (msg.typeCheck.isImage || msg.typeCheck.isQuotedImage) {
            let path = Date.now()
            let file = (await msg.download('buffer') || (msg.quoted && (await msg.quoted.download('buffer'))))

            await fs.writeFileSync('library/upload/' + path + '.jpg', file)
            let filedata = await lolhuman('convert2pdf?filename=' + path + '.jpg' + '&file=' + process.env.BASE_URL + 'upload/' + path + '.jpg')

            await fs.unlinkSync('upload/' + path + '.jpg')

            if (filedata.status && filedata.status === 500) return msg.reply(process.env.MESSAGE_ERROR)
            return msg.replyDocument({ url: filedata }, 'application/pdf', path + '.pdf')
        } else return msg.reply(process.env.MESSAGE_NOMEDIA.replace('{prefix + command}', prefix + command))
    }
}