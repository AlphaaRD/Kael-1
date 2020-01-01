const { Listener } = require("../")

module.exports = class AutoRole extends Listener {
  constructor (client) {
    super(client)
    this.events = {
      guildMemberAdd: this.uponEntry,
    }
  }
  
  async uponEntry (member) {
    if (!this.client.db || !this.client.db.mongoose.connection) return
    
    const doc = await this.client.db.guilds.get(member.guild.id, { autorole_roles: 1 }, { lean: true })
    
    member.addRoles(doc.autorole_roles)
  }
}
