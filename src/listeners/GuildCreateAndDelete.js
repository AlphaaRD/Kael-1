const { Listener } = require("../")

module.exports = class GuildCreateAndDelete extends Listener {
  constructor (client) {
    super(client)
    this.events = {
      guildCreate: this.newGuild,
      guildDelete: this.deleteGuild
    }
  }

  newGuild (guild) {
    if (!this.client.db || !this.client.db.mongoose.connection) return
    if (!guild || !guild.id) return
    this.client.db.guilds.add(guild.id)
  }

  deleteGuild (guild) {
    if (!this.client.db || !this.client.db.mongoose.connection) return
    if (!guild || !guild.id) return
    this.client.db.guilds.getAndDelete(guild.id)
  }
}
