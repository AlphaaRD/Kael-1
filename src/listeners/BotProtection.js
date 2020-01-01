const { Listener } = require("../")

module.exports = class BotProtection extends Listener {
  constructor (client) {
    super(client)
    this.events = {
      guildMemberAdd: this.checkBot
    }
  }

  async checkBot (member) {
    if (!this.client.db || !this.client.db.mongoose.connection) return
    if (!member.user.bot) return

    const doc = await this.client.db.guilds.get(member.guild.id, { sec_bots: 1, lang: 1 }, { lean: true })
    const t = this.client.i18n.getFixedT(doc.lang)

    if (doc.sec_bots) member.kick(t("security:bot"))
  }
}
