import * as express from "express"
import * as Discord from "discord.js"

import { startBot, sendWarning } from "./bot"
import { memberCheck } from "./functions"
import * as config from "./config.json"

const app = express()
const PORT = 4500

const discordClient = startBot()

app.get(`/`, (req, res) => {
    memberCheck(discordClient, config.guildID, config.botID).then((member: Discord.GuildMember) => {
        res.json({ readyAt: discordClient.readyTimestamp, botState: member.presence.status, bot: member.user })
    })
})

app.listen(PORT, () => {
    console.log(`[server] Started listening at port ${PORT}`)
})

discordClient.on("ready", () => {
    setInterval(async function () {
        memberCheck(discordClient, config.guildID, config.botID).then(async (member: Discord.GuildMember) => {
            if (member) {
                const state = member.presence.status

                if (state !== "online") sendWarning()
            }
        })
    }, 1000)
})