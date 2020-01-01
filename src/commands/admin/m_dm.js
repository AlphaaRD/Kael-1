const { Command } = require("../../")

module.exports = class MessageDM extends Command {
  constructor (client) {
    super(client, {
      name: "dm",
      aliases: ["privado"],
      userPerm: ["ADMINISTRATOR"],
      parentCommand: "message"
    })
  }

  async run ({t, message, prefix}, args) {
    const MAX_LENGTH = 400
    const USER = message.author.toString()

    let doc = await this.client.db.guilds.get(message.guild.id, { welcome_dm: 1 })

    const newMessage = args.slice(1).join(" ")

    if (!newMessage.length)
      return message.channel.send(t("commands:message.subCommands.dm.errors.noArgs", { user: USER, prefix }))

    if (newMessage.length > MAX_LENGTH)
      return message.channel.send(t("commands:message.subComamnds.dm.errors.lengthLimit", { user: USER, max: MAX_LENGTH }))

    doc.welcome_dm = newMessage

    await doc.save()

    message.channel.send(t("commands:message.subCommands.dm.setMessage", { user: USER, message: newMessage }))
  }
}
