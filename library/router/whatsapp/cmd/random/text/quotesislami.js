const { lolhuman } = require('@router/myfunc')

module.exports = {
    category: 'Random Text',
    callback: async ({ msg }) => {
        let filedata = await lolhuman('quotes/islami')
        if (!filedata || filedata.status && filedata.status === 500) return msg.reply(process.env.MESSAGE_ERROR)

        return msg.reply(filedata)
    }
}