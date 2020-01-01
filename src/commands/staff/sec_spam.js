const { Command } = require("../../")

module.exports = class SecuritySpam extends Command {
  constructor (client) {
    super(client, {
      name: "spam",
      userPerm: ["ADMINISTRATOR"],
      dbOnly: true,
      parentCommand: "security"
    })
  }

  async run ({t, message}) {
    const USER = message.author.toString()
    let doc = await this.client.db.guilds.get(message.guild.id)

    doc.sec_spam = doc.sec_spam ? false : true

    await doc.save()

    if (doc.sec_spam)
      message.channel.send(t("commands:security.subcommands.spam.activated", { user: USER }))
    else
      message.channel.send(t("commands:security.subcommands.spam.deactivated", { user: USER }))
  }
}
