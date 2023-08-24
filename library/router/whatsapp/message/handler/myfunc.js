const fs = require('fs')
const axios = require('axios')
const BodyForm = require('form-data')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

const downloadMedia = async (msg, returnType) => {
    try {
        const type = Object.keys(msg)[0]
        const mimeMap = { imageMessage: 'image', videoMessage: 'video', stickerMessage: 'sticker', documentMessage: 'document', audioMessage: 'audio', }
        const stream = await downloadContentFromMessage(msg[type], mimeMap[type])

        if (returnType === 'stream') return stream
        let buffer = Buffer.from([])

        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        return buffer
    } catch { return null }
}

const urlType = async (url) => {
    return new Promise(async (resolve, reject) => {
        if (!url || !/http:|https:/.test(url)) {
            return resolve({ status: false, message: 'Masukkan url dengan benar' })
        } else if (/http:|https:/.test(url) && /instagram.com/.test(url)) {
            return resolve({ status: true, message: 'instagram' })
        } else if (/http:|https:/.test(url) && /tiktok.com/.test(url)) {
            return resolve({ status: true, message: 'tiktok' })
        } else if (/http:|https:/.test(url) && /youtube.com|youtu.be/.test(url)) {
            return resolve({ status: true, message: 'youtube' })
        } else if (/http:|https:/.test(url) && /facebook.com|fb.watch/.test(url)) {
            return resolve({ status: true, message: 'facebook' })
        } else if (/http:|https:/.test(url) && /twitter.com/.test(url)) {
            return resolve({ status: true, message: 'twitter' })
        } else if (/http:|https:/.test(url) && /soundcloud.com/.test(url)) {
            return resolve({ status: true, message: 'soundcloud' })
        } else if (/http:|https:/.test(url) && /mediafire.com/.test(url)) {
            return resolve({ status: true, message: 'mediafire' })
        } else {
            return resolve({ status: false, message: 'Masukkan url dengan benar' })
        }
    })
}

const telegraph = async (Path) => {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(Path)) return reject(new Error("File not Found"))

        try {
            const form = new BodyForm();
            form.append("file", fs.createReadStream(Path))

            const data = await axios({
                url: "https://telegra.ph/upload",
                method: "POST",
                headers: {
                    ...form.getHeaders()
                },
                data: form
            })

            return resolve("https://telegra.ph" + data.data[0].src)
        } catch (err) {
            return reject(new Error(String(err)))
        }
    })
}

const uploadFile = async (input) => {
    return new Promise(async (resolve, reject) => {
        const form = new BodyForm();
        form.append("files[]", fs.createReadStream(input))
        await axios({
            url: "https://uguu.se/upload.php",
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
                ...form.getHeaders()
            },
            data: form
        }).then((data) => {
            resolve(data.data.files[0])
        }).catch((err) => reject(err))
    })
}

module.exports = { downloadMedia, urlType, telegraph, uploadFile }