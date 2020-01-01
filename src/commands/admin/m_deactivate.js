const { Command } = require("../../")

module.exports = class MessageDeactivate extends Command {
  constructor (client) {
    super(client, {
      name: "deactivate",
      aliases: ["disable", "desativar"],
      userPerm: ["ADMINISTRATOR"],
      parentCommand: "message"
    })
  }

  async run ({t, message}, args) {
    const USER = message.author.toString()

    let doc = await this.client.db.guilds.get(message.guild.id, {
      welcome_channel: 1, welcome_message: 1, welcome_dm: 1, leave_channel: 1, leave_message: 1
    })

    const [, type] = args

    if (!type) return

    // Small hack, gets all translations of a key
    const welcomeVariations = []
    const dmVariations = []
    const goodbyeVariations = []
    this.client.i18n.languages.forEach(lang => {
      let tt = this.client.i18n.getFixedT(lang)
      welcomeVariations.push(tt("constants:welcome"))
      dmVariations.push(tt("constants:dm"))
      goodbyeVariations.push(tt("constants:goodbye"))
    })

    if (welcomeVariations.includes(type)) {
      const channel = message.guild.channels.get(doc.welcome_channel)
      const m = doc.welcome_message

      if (!channel || !m)
        return message.channel.send(t("commands:message.subCommands.deactivate.errors.welcomeAlreadyDeactivated", { user: USER }))

      doc.welcome_channel = ""
      doc.welcome_message = ""
      await doc.save()

      return message.channel.send(t("commands:message.subCommands.deactivate.welcome", { user: USER }))
    }

    if (dmVariations.includes(type)) {
      const m = doc.welcome_dm

      if (!m)
        return message.channel.send(t("commands:message.subCommands.deactivate.errors.dmAlreadyDeactivated", { user: USER }))

      doc.welcome_dm = ""
      await doc.save()

      return message.channel.send(t("commands:message.subCommands.deactivate.dm", { user: USER }))
    }

    if (goodbyeVariations.includes(type.replace("í", "i"))) {
      const channel = message.guild.channels.get(doc.leave_channel)
      const m = doc.leave_message

      if (!channel || !m)
        return message.channel.send(t("commands:message.subCommands.deactivate.errors.goodbyeAlreadyDeactivated", { user: USER }))

      doc.leave_channel = ""
      doc.leave_message = ""
      await doc.save()

      return message.channel.send(t("commands:message.subCommands.deactivate.goodbye", { user: USER }))
    }
  }
}
