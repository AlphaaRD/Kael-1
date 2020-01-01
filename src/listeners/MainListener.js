const { Listener } = require("../")

module.exports = class MainListener extends Listener {
  constructor (client) {
    super(client)
    this.events = {
      message: this.onMessage,
      ready: this.onReady,
    }
  }

  onReady () {
    console.log(`Logged as ${this.client.user.tag} in ${this.client.guilds.size} guilds and ${this.client.users.size} users\n`)

    this.client.user.setPresence({
      game: {
        name: "cet leaK",
        type: "STREAMING",
        url: "https://twitch.tv/cet_leaK"
      }
    })
  }

  async onMessage (message) {
    if (!message || !message.guild || !message.guild.available) return
    if (message.author.bot) return

    const { prefix, lang } = await this.getInfo(message.guild.id)

    if (!message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    let cmd = this.client.commands.find(c => c.name === command || c.aliases.includes(command))
    if (!cmd) return

    const t = this.client.i18n.getFixedT(lang)

    try {
      console.log(
        `Command ${cmd.name} ran by "${message.author.tag}" (${message.author.id})\n` +
        `At guild "${message.guild.name}" (${message.guild.id})\n` +
        `On channel #${message.channel.name} (${message.channel.id})\n`
      )
      cmd._run({t, message, prefix}, args)
    } catch (e) {
      console.error(`[Error] [${cmd.name}]`, e)
    }
  }

  async getInfo (id) {
    if (!this.client.db || !this.client.db.mongoose.connection) {
      const schemas = require("../Schemas")
      const prefix = schemas.guilds.tree.prefix.default
      const lang = schemas.guilds.tree.lang.default
      return { prefix, lang }
    }
    const doc = await this.client.db.guilds.get(id, { prefix: 1, lang: 1 }, { lean: true })
    return doc
  }
}
