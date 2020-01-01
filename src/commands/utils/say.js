const { Command } = require("../../")

module.exports = class Say extends Command {
  constructor (client) {
    super(client, {
      name: "say",
      aliases: ["falar", "hablar"],
      userPerm: ["ADMINISTRATOR"],
      category: "util"
    })
  }

  async run ({t, message}, args) {
    const text = args.join(" ")

    if (!text) return message.channel.send(t("commands:say.errors.noArgs", { user: message.author.toString() }))

    // remove permission requirements and clean text content?
    message.channel.send(text)
  }
}
