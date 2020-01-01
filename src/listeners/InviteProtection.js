const { Listener } = require("../")

module.exports = class InviteProtection extends Listener {
  constructor (client) {
    super(client)
    this.events = {
      message: this.checkInvite
    }
  }

  async checkInvite (message) {
    if (!this.client.db || !this.client.db.mongoose.connection) return
    if (!message || !message.guild || !message.guild.available) return

    let doc = await this.client.db.guilds.get(message.guild.id, { sec_invite: 1, transgressors: 1, lang: 1 })
    const t = this.client.i18n.getFixedT(doc.lang)

    if (!doc.sec_invite) return

    if (message.member.hasPermission("ADMINISTRATOR", false, false, true)) return

    if (!/discord\.gg/.test(message.content)) return

    let transgressors = doc.transgressors
    let transgressor = doc.transgressors.find(t => t._id === message.author.id)
    if (!transgressor) {
      transgressors.push({ _id: message.author.id, infractions: 0 })
      transgressor = transgressors[transgressors.length - 1]
    }

    transgressor.infractions += 1

    await doc.save()

    message.delete()
    message.channel.send(t("security:invite.infraction", { user: message.author.toString(), count: transgressor.infractions }))

    if (transgressor.infractions >= 3)
      message.member.ban({ reason: t("security:invite.banReason", { bot: this.client.user.tag, channelName: message.channel.name }) })
        .then(() => message.channel.send(t("security:invite.memberBanned", { tag: message.author.tag })))
  }
}
