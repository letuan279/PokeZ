const express = require('express')
const app = express()
const cheerio = require('cheerio');
const cors = require('cors')

app.use(cors())
app.use(express.json())


const getPokeStatus = async (data) => {
    try {
        //name, iv, cp, dsp, lv, timeStart, image, location, country
        const ans = {}
        // get name
        ans.name = data.content.split('***')[1]
        // get iv
        ans.iv = data.content.split('***')[2].split('**')[0].split(' ')[2].slice(2)
        // get cp
        ans.cp = data.content.split('***')[2].split('**')[1].slice(2)
        // get lv
        ans.lv = data.content.split('***')[2].split('**')[3].slice(1)
        // get dsp
        ans.dsp = data.content.slice(data.content.indexOf(' in ') + 4, data.content.indexOf(' in ') + 6)
        // get time
        ans.timeStart = new Date(data.timestamp).toLocaleString()
        // get country 
        ans.country = 'https://flagcdn.com/48x36/' + data.content.split('***')[0].split(':')[1].split('_')[1] + '.png'
        // get image
        ans.image = `https://cdn.discordapp.com/emojis/${data.content.split('***')[2].split(' ')[1].split(':')[2].slice(0, -3)}.gif?size=56&quality=lossless`
        // get location
        const link = data.embeds[0].description.split('|')[0].split('(')[1].trim().slice(0, -1)
        let html = await fetch(link, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
                "cache-control": "max-age=0",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "cross-site",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "sessionid=bcs344oe453urx7rxsl5b54fdedhf33t; csrftoken=xUkp5QjeZUg97nmjNdeFxTHLnQmXX9D6Skl6fGw9kyl41lIFDtcxyCyix19Rt02g"
            },
            "referrerPolicy": "no-referrer",
            "body": null,
            "method": "GET"
        });
        html = await html.text()
        const $ = cheerio.load(html)
        ans.location = $('#community-coord').attr('value')

        return ans
    } catch (error) {
        console.log(error);
        return {}
    }
}

const getMessage = async (groupId, groupName) => {
    try {
        const res = await fetch("https://discord.com/api/v9/channels/" + groupId + "/messages?limit=15", {
            "headers": {
                "accept": "*/*",
                "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
                "authorization": "NDQ1NDExMzc0MzQ1MjI0MjAz.GKTTbc.vjQvSeKnBNl0YwOYIUD7ezDVUHzv18l1N76KlY",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-debug-options": "bugReporterEnabled",
                "x-discord-locale": "en-US",
                "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwOC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTA4LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiJodHRwczovL3d3dy5nb29nbGUuY29tLyIsInJlZmVycmluZ19kb21haW4iOiJ3d3cuZ29vZ2xlLmNvbSIsInNlYXJjaF9lbmdpbmUiOiJnb29nbGUiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6MTY1NDg1LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
                "cookie": "_ga=GA1.2.1716287896.1614257463; __dcfduid=6230c68089d011edb1fc3f7a0ed6f3bf; __sdcfduid=6230c68189d011edb1fc3f7a0ed6f3bfbd10cd21a66f601b23aa5d3d6dfbbcd4058470d5d388ebcd64dc17ce12812cf9; __cfruid=33a52662f7cd489fd242ec366e79bf88d0312a30-1672576361; _gcl_au=1.1.385296743.1672576367; _gid=GA1.2.1982119011.1672576368; OptanonConsent=isIABGlobal=false&datestamp=Sun+Jan+01+2023+19:50:40+GMT+0700+(Indochina+Time)&version=6.33.0&hosts=&landingPath=https://discord.com/&groups=C0001:1,C0002:1,C0003:1; locale=en-US; __cf_bm=mMV6IHTnT_Mod1vE2vOREfCo3wPrDCtB4fwG2vrYTAc-1672582276-0-AVW0/Q6aPI/xwPAm2BcDIuXvRQK2hlas/Il7xDRgGdqHw8OhqnxeUk8ETA+7prPXV406t+7FWgwWF06FVNhTEhQC1caBiJq5sI+r+O3aumJcXMkY6AwTU+Wxtji9taRT2v+2krolac4GHi9KkE0Ar+8=",
                "Referer": "https://discord.com/channels/252776251708801024/" + groupId,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        })
        const resJson = await res.json()
        const data = []
        const promiseArray = []
        for (let index = 0; index < resJson.length; index++) {
            promiseArray.push(getPokeStatus(resJson[index]))
            if ((index + 1) % 5 === 0) {
                await Promise.all(promiseArray).then(values => {
                    values.forEach(item => {
                        const { name, iv, cp, dsp, lv, timeStart, image, location, country } = item
                        data.push({
                            id: data.length + 1,
                            group: groupName,
                            name,
                            iv,
                            cp,
                            dsp,
                            lv,
                            timeStart,
                            image,
                            location,
                            country
                        })
                    })
                })
            }
        }
        console.log(data);
        return data
    } catch (error) {
        console.log(error);
    }
}

app.post('/', async (req, res) => {
    try {
        const group = req.body
        const data = await getMessage(group.id, group.name)
        return res.json({ success: true, data })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'server error' })
    }
})

app.listen(3001, () => {
    console.log('server running in port 3001....');
})