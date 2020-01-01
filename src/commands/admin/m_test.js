const { Command } = require("../../")

module.exports = class MessageTest extends Command {
  constructor (client) {
    super(client, {
      name: "test",
      aliases: ["testar"],
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

    const formatDate = (date) => {
      return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }

    const replace = (m) => {
      return m
        .replace(/\[user\.created\]/g, formatDate(message.author.createdAt))
        .replace(/\[member\]/g, message.author.toString())
        .replace(/\[guild\.name\]/g, message.guild.name)
        .replace(/\[guild\.id\]/g, message.guild.id)
        .replace(/\[member\.username\]/g, message.author.username)
        .replace(/\[member\.avatar\]/g, message.author.displayAvatarURL)
        .replace(/\[member\.id\]/g, message.author.id)
    }

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
        return message.channel.send(t("commands:message.subCommands.test.errors.welcomeNotActive", { user: USER }))

      channel.send(replace(m), { split: true })
    }

    if (dmVariations.includes(type)) {
      const channel = message.author
      const m = doc.welcome_dm

      if (!channel || !m)
        return message.channel.send(t("commands:message.subCommands.test.errors.dmNotActive", { user: USER }))

      channel.send(replace(m), { split: true })
    }

    if (goodbyeVariations.includes(type.replace("í", "i"))) {
      const channel = message.guild.channels.get(doc.leave_channel)
      const m = doc.leave_message

      if (!channel || !m)
        return message.channel.send(t("commands:message.subCommands.test.errors.goodbyeNotActive", { user: USER }))

      channel.send(replace(m), { split: true })
    }
  }
}
