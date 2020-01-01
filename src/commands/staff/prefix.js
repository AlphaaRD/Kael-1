const { Command } = require("../../")

module.exports = class Prefix extends Command {
  constructor (client) {
    super(client, {
      name: "prefix",
      aliases: ["prefixo"],
      userPerm: ["MANAGE_GUILD"],
      category: "staff"
    })
  }

  async run ({t, message, prefix}, args) {
    const USER = message.author.toString()
    const MAX = 2
    const [newPrefix] = args

    if (!newPrefix)
      return message.channel.send(t("commands:prefix.errors.noArgs", { user: USER, prefix }))

    if (newPrefix.length > MAX)
      return message.channel.send(t("commands:prefix.errors.lengthLimit", { user: USER, MAX }))

    let doc = await this.client.db.guilds.get(message.guild.id, { prefix: 1 })

    doc.prefix = newPrefix

    await doc.save()

    message.channel.send(t("commands:prefix.changed", { user: USER, prefix: newPrefix }))
  }
}
