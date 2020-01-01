const { Command } = require("../../")

module.exports = class SecurityInvite extends Command {
  constructor (client) {
    super(client, {
      name: "invite",
      userPerm: ["ADMINISTRATOR"],
      dbOnly: true,
      parentCommand: "security"
    })
  }

  async run ({t, message}) {
    const USER = message.author.toString()
    let doc = await this.client.db.guilds.get(message.guild.id)

    doc.sec_invite = doc.sec_invite ? false : true

    await doc.save()

    if (doc.sec_invite)
      message.channel.send(t("commands:security.subcommands.invite.activated", { user: USER }))
    else
      message.channel.send(t("commands:security.subcommands.invite.deactivated", { user: USER }))
  }
}
