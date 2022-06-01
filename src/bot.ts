import * as Discord from "discord.js"
import * as env from "dotenv"
import * as config from "./config.json"

env.config()

let allarmed = false

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
    ],
    makeCache: Discord.Options.cacheEverything()
})

export function startBot() {
    client.login(process.env.TOKEN)

    client.on("ready", async () => {
        console.log("[discord.js] Discord agent running")

    })

    return client
}

export async function sendWarning() {
    if (!allarmed) {
        const owner = await client.users.fetch(config.ownerID)

        const embed = new Discord.MessageEmbed()
            .setColor(config.waringColor as Discord.ColorResolvable)
            .setTitle("⚠ BOT OFFLINE")
            .setDescription("• Wykryto, że bot przeszedł w tryb offline. Po naprawieniu błędu zareaguj pod tą wiadomością.")
            .setTimestamp()
        owner.send({ embeds: [embed] }).then(async message => {
            message.react("⚒️")

            const reactionFilter = (reaction: Discord.MessageReaction, user: Discord.User) => reaction.emoji.name == "⚒️" && user.id == owner.id
            const reactionCollector = message.createReactionCollector({filter: reactionFilter})

            reactionCollector.on("collect", r => {
                allarmed = false
            })
        })

        allarmed = true
    }
}
sendWarning