import * as Discord from "discord.js"
import { exec } from 'child_process'

export async function memberCheck(client: Discord.Client, guildID: string, userID: string) {
    return new Promise(async function (resolve, reject) {
        const guild = await client.guilds.fetch(guildID)
        if(!guild) reject(undefined)

        const member = await guild.members.fetch(userID)
        
        if(!member) reject(undefined)
        else {
            resolve(member)
        }
    })
}

export function restartBot(command: string) {
    console.log(command)
    const child = exec(command)
}