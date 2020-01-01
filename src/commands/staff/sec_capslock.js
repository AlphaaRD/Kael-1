const { Command } = require("../../")

module.exports = class SecurityCapslock extends Command {
  constructor (client) {
    super(client, {
      name: "capslock",
      userPerm: ["ADMINISTRATOR"],
      dbOnly: true,
      parentCommand: "security"
    })
  }

  async run ({t, message}, [, percentage]) {
    const USER = message.author.toString()
    let doc = await this.client.db.guilds.get(message.guild.id)
    if (!percentage) {
      doc.sec_capslock = doc.sec_capslock ? false : true
      doc.sec_capslock_percentage = 100
      await doc.save()
      if (doc.sec_capslock)
        return message.channel.send(t("commands:security.subcommands.capslock.activated", { user: USER, percentage: 100 }))
      else
        return message.channel.send(t("commands:security.subcommands.capslock.deactivated", { user: USER }))
    }

    percentage = Number(percentage)
    if (isNaN(percentage))
      return message.channel.send(t("commands:security.subcommands.capslock.errors.NaN", { user: USER }))
    percentage = Math.floor(percentage)

    if (percentage < 1 || percentage > 100)
      return message.channel.send(t("commands:security.subcommands.capslock.errors.range", { user: USER }))

    doc.sec_capslock = true
    doc.sec_capslock_percentage = percentage

    await doc.save()

    message.channel.send(t("commands:security.subcommands.capslock.activated", { user: USER, percentage }))
  }
}
