const { Command } = require("../../")

module.exports = class SecurityBots extends Command {
  constructor (client) {
    super(client, {
      name: "bots",
      userPerm: ["ADMINISTRATOR"],
      dbOnly: true,
      parentCommand: "security"
    })
  }

  async run ({t, message}) {
    const USER = message.author.toString()
    let doc = await this.client.db.guilds.get(message.guild.id)

    doc.sec_bots = doc.sec_bots ? false : true

    await doc.save()

    if (doc.sec_bots)
      message.channel.send(t("commands:security.subcommands.bots.activated", { user: USER }))
    else
      message.channel.send(t("commands:security.subcommands.bots.deactivated", { user: USER }))
  }
}
