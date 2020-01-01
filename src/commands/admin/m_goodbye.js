const { Command } = require("../../")

module.exports = class MessageGoodbye extends Command {
  constructor (client) {
    super(client, {
      name: "goodbye",
      aliases: ["saida", "saída"],
      userPerm: ["ADMINISTRATOR"],
      parentCommand: "message"
    })
  }

  async run ({t, message}, args) {
    const MAX_LENGTH = 400
    const USER = message.author.toString()

    let doc = await this.client.db.guilds.get(message.guild.id, { welcome_channel: 1, welcome_message: 1 })

    const [channelId] = /[0-9]{18}/.exec(args[1]) || [null]
    const newMessage = args.slice(1).join(" ")

    if (!newMessage.length || channelId) {
      const newChannel = message.guild.channels.get(channelId) || message.channel;

      doc.leave_channel = newChannel.id

      await doc.save()

      return message.channel.send(t("commands:message.subCommands.goodbye.setChannel", { user: USER, channel: newChannel.toString() }))
    }

    if (newMessage.length > MAX_LENGTH)
      return message.channel.send(t("commands:message.subCommands.goodbye.errors.lengthLimit", { user: USER, max: MAX_LENGTH }))

    doc.leave_message = newMessage

    await doc.save()

    message.channel.send(t("commands:message.subCommands.goodbye.setMessage", { user: USER, message: newMessage }))
  }
}
