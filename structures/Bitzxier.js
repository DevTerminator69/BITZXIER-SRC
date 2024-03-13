const { Client, Collection, Intents, WebhookClient } = require('discord.js')
const fs = require('fs')
const mongoose = require('mongoose')
const Utils = require('./util')
const Sweeper = require('./Sweepers')
const { glob } = require('glob')
const { promisify } = require('util')
const { Database } = require('quickmongo')
const globPromise = promisify(glob)
const axios = require('axios');
module.exports = class Bitzxier extends Client {
    constructor() {
        super({
            intents: 32767,
            fetchAllMembers : false,
             shards : "auto",
            disableEveryone : true
                })

        this.config = require(`${process.cwd()}/config.json`)
        this.logger = require('./logger')
        this.commands = new Collection()
        this.categories = fs.readdirSync('./commands/')
        this.emoji = {
            tick: '<:tick:1180470648053702657>',
            cross: '<:crosss:1180470543896551438>',
            dot: '<:bitzxier:1180449001934442516>'
        }
        this.util = new Utils(this)
        this.color = `#ff0000`
        this.support = `https://discord.gg/S7Ju9RUpbT`
        this.cooldowns = new Collection()
        this.snek = require('axios')
        this.ratelimit = new WebhookClient({
            url: 'https://discord.com/api/webhooks/1198206014860836934/X997VwN3ESSyERfanZZZMdRm8FBKdfK-MBYIc5HE3gcvheEv_Xq4aLjCgjtWNq2MLuiW'
        });
        this.error = new WebhookClient({
            url: 'https://discord.com/api/webhooks/1198206014860836934/X997VwN3ESSyERfanZZZMdRm8FBKdfK-MBYIc5HE3gcvheEv_Xq4aLjCgjtWNq2MLuiW'
        })
        this.on('error', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``)
        })
        process.on('unhandledRejection', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``)
        })
        process.on('uncaughtException', (error) => {
            this.error.send(`\`\`\`js\n${error.stack}\`\`\``)
        })
        process.on("warning", (warn) => {
            this.error.send(`\`\`\`js\n${warn}\`\`\``)
        })
        process.on("uncaughtExceptionMonitor", (err, origin) => { 
            this.error.send(`\`\`\`js\n${err},${origin}\`\`\``)
        })
            this.on("rateLimit", (info) => {
        this.ratelimit.send({content: `\`\`\`js\nTimeout: ${info.timeout},\nLimit: ${info.limit},\nMethod: ${info.method},\nPath: ${info.path},\nRoute: ${info.route},\nGlobal: ${info.global}\`\`\``});
        });
    }   
        
    async initializeMongoose() {
        this.db = new Database(this.config.MONGO_DB)
        this.db.connect()
        this.logger.log(`Connecting to MongoDb...`)
        mongoose.connect(this.config.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        this.logger.log('Mongoose Database Connected', 'ready')
    }
    async loadEvents() {
        fs.readdirSync('./events/').forEach((file) => {
            let eventName = file.split('.')[0]
            require(`${process.cwd()}/events/${file}`)(this)
            this.logger.log(`Updated Event ${eventName}.`, 'event')
        })
    }
    
    async loadMain() {
        const commandFiles = []

        const commandDirectories = fs.readdirSync(`${process.cwd()}/commands`)

        for (const directory of commandDirectories) {
            const files = fs
                .readdirSync(`${process.cwd()}/commands/${directory}`)
                .filter((file) => file.endsWith('.js'))

            for (const file of files) {
                commandFiles.push(
                    `${process.cwd()}/commands/${directory}/${file}`
                )
            }
        }
        commandFiles.map((value) => {
            const file = require(value)
            const splitted = value.split('/')
            const directory = splitted[splitted.length - 2]
            if (file.name) {
                const properties = { directory, ...file }
                this.commands.set(file.name, properties)
            }
        })
        this.logger.log(`Updated ${this.commands.size} Commands.`, 'cmd')
    }
}
