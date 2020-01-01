const { Listener } = require("../")

const cache = new Map()

const set = (identifier, data) => {
  cache.set(identifier, data)
  clean(identifier)
}

const clean = (identifier) => {
  setTimeout(() => {
    let data = cache.get(identifier)
    if (!data) return
    data.pop()
    cache.set(identifier, data)
  }, 4000)
}

module.exports = class CapslockProtection extends Listener {
  constructor (client) {
    super(client)
    this.events = {
      message: this.checkSpam
    }
  }

  async checkSpam (message) {
    if (!this.client.db || !this.client.db.mongoose.connection) return
    if (!message || !message.guild || !message.guild.available) return

    let doc = await this.client.db.guilds.get(message.guild.id, {
      sec_spam: 1, transgressors: 1, lang: 1
    })

    const t = this.client.i18n.getFixedT(doc.lang)

    if (!doc.sec_spam) return

    if (message.member.hasPermission("ADMINISTRATOR", false, false, true)) return

    const identifier = `${message.guild.id}:${message.author.id}`

    let entry = cache.get(identifier)
    if (!entry) {
      set(identifier, [message.content])
      entry = cache.get(identifier)
    } else {
      entry.unshift(message.content)
      clean(identifier)
    }

    let equal = 0
    for (let i = 1; i < entry.length; ++i) {
      if (entry[0] === entry[i]) ++equal
    }

    if (equal < 5) return

    let transgressors = doc.transgressors
    let transgressor = doc.transgressors.find(t => t._id === message.author.id)
    if (!transgressor) {
      transgressors.push({ _id: message.author.id, infractions: 0 })
      transgressor = transgressors[transgressors.length - 1]
    }

    transgressor.infractions += 1

    await doc.save()

    message.delete()
    message.channel.send(t("security:spam.infraction", { user: message.author.toString(), count: transgressor.infractions }))

    if (transgressor.infractions >= 5)
      message.member.kick(t("security:spam.kickReason", { bot: this.client.user.tag, channelName: message.channel.name }))
        .then(() => message.channel.send(t("security:spam.memberKicked", { tag: message.author.tag })))
        .finally(() => cache.delete(identifier))
  }
}
