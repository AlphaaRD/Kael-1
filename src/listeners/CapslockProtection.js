const { Listener } = require("../")

module.exports = class CapslockProtection extends Listener {
  constructor (client) {
    super(client)
    this.events = {
      message: this.checkCaps
    }
  }

  async checkCaps (message) {
    if (!this.client.db || !this.client.db.mongoose.connection) return
    if (!message || !message.guild || !message.guild.available) return
    if (!message.member) return

    let doc = await this.client.db.guilds.get(message.guild.id, {
      sec_capslock: 1, sec_capslock_percentage: 1, transgressors: 1, lang: 1
    })

    const t = this.client.i18n.getFixedT(doc.lang)

    if (!doc.sec_capslock) return

    if (message.member.hasPermission("ADMINISTRATOR", false, false, true)) return
    if (message.content.length <= 5) return

    let caps = 0
    let splitContent = message.content.split("")
    const isUpper = (char) => char.toUpperCase() === char && char.toLowerCase() !== char
    for (let i = 0; i < splitContent.length; ++i) {
      if (isUpper(splitContent[i])) ++caps
    }

    let capsPercentage = (splitContent.length / 100) * caps * 100
    if (doc.sec_capslock_percentage > capsPercentage) return

    let transgressors = doc.transgressors
    let transgressor = doc.transgressors.find(t => t._id === message.author.id)
    if (!transgressor) {
      transgressors.push({ _id: message.author.id, infractions: 0 })
      transgressor = transgressors[transgressors.length - 1]
    }

    transgressor.infractions += 1

    await doc.save()

    message.delete()
    message.channel.send(t("security:capslock.infraction", { user: message.author.toString(), count: transgressor.infractions }))

    if (transgressor.infractions >= 10)
      message.member.kick(t("security:capslock.kickReason", { bot: this.client.user.tag, channelName: message.channel.name }))
        .then(() => message.channel.send(t("security:capslock.memberKicked", { tag: message.author.tag })))
  }
}
