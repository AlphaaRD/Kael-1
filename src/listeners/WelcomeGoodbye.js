const { Listener } = require("../")

module.exports = class Welcome extends Listener {
  constructor (client) {
    super(client)
    this.events = {
      guildMemberAdd: this.welcomeMember,
      guildMemberRemove: this.memberGoodbye
    }
  }

  async welcomeMember (member) {
    if (!this.client.db || !this.client.db.mongoose.connection) return

    const doc = await this.client.db.guilds.get(member.guild.id, {
      welcome_channel: 1, welcome_message: 1, welcome_dm: 1
    }, { lean: true })

    const welcomeChannel = member.guild.channels.get(doc.welcome_channel)
    const welcomeMessage = doc.welcome_message
    if (welcomeChannel && welcomeMessage.length)
      welcomeChannel.send(replace(welcomeMessage, member))

    const dmMessage = doc.welcome_dm
    if (dmMessage.length)
      member.send(replace(dmMessage, member))
  }

  async memberGoodbye (member) {
    if (!this.client.db || !this.client.db.mongoose.connection) return

    const doc = await this.client.db.guilds.get(member.guild.id, {
      leave_channel: 1, leave_message: 1
    }, { lean: true })

    const goodbyeChannel = member.guild.channels.get(doc.leave_channel)
    const goddbyeMessage = doc.leave_message
    if (goodbyeChannel && goddbyeMessage.length)
      goodbyeChannel.send(replace(goddbyeMessage, member))
  }
}

const formatDate = (date) => {
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}

const replace = (message, member) => {
    return message
      .replace(/\[user\.created\]/g, formatDate(member.user.createdAt))
      .replace(/\[member\]/g, member.user.toString())
      .replace(/\[guild\.name\]/g, member.guild.name)
      .replace(/\[guild\.id\]/g, member.guild.id)
      .replace(/\[member\.username\]/g, member.user.username)
      .replace(/\[member\.avatar\]/g, member.user.displayAvatarURL)
      .replace(/\[member\.id\]/g, member.id)
}
