const { Command, Embed } = require("../../")
const missingIcon = "https://i.imgur.com/mrsOneH.png"

module.exports = class Icon extends Command {
  constructor (client) {
    super(client, {
      name: "icon",
      aliases: ["ícone", "icone"],
      category: "util"
    })
  }

  async run ({t, message}) {
    const icon = message.guild.iconURL ? message.guild.iconURL + "?size=2048" : undefined
    let embed = new Embed()
      .setDescription(icon ? t("commands:icon.embed.title") : t("commands:icon.embed.errorTitle"))
      .setImage(icon || missingIcon)
    message.channel.send(embed)
  }
}
