const { lolhuman } = require('@router/myfunc')

module.exports = {
    category: 'Random Text',
    callback: async ({ msg }) => {
        let data = await lolhuman('random/katabijak?')
        if (!data || data.status && data.status === 500) return msg.reply(process.env.MESSAGE_ERROR)

        return msg.reply(data)
    }
}