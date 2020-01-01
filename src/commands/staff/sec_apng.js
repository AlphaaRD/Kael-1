const { Command } = require("../../")

module.exports = class SecurityApng extends Command {
  constructor (client) {
    super(client, {
      name: "apng",
      userPerm: ["ADMINISTRATOR"],
      dbOnly: true,
      parentCommand: "security"
    })
  }

  async run ({t, message}) {
    const USER = message.author.toString()
    let doc = await this.client.db.guilds.get(message.guild.id)

    doc.sec_apng = doc.sec_apng ? false : true

    await doc.save()

    if (doc.sec_apng)
      message.channel.send(t("commands:security.subcommands.apng.activated", { user: USER }))
    else
      message.channel.send(t("commands:security.subcommands.apng.deactivated", { user: USER }))
  }
}
