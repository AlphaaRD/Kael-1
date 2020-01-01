const { Listener } = require("../")

module.exports = class ApngProtection extends Listener {
  constructor (client) {
    super(client)
    this.events = {
      guildMemberAdd: this.checkApng
    }
  }

  async checkApng (member) {
    if (!this.client.db || !this.client.db.mongoose.connection) return

    let doc = await this.client.db.guilds.get(member.guild.id, { sec_apng: 1, lang: 1 }, { lean: true })
    const t = this.client.i18n.getFixedT(doc.lang)
    if (!doc.sec_apng) return

    let avatarUrl = member.user.displayAvatarURL
    if (!avatarUrl) return
    let url = new URL(avatarUrl)
    if (url.pathname.endsWith(".apng")) member.ban({ reason: t("security:apng") })
  }
}
