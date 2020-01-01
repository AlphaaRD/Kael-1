const { Command, Embed } = require("../../")
const imageURL = "https://cdn.discordapp.com/attachments/507373669413027852/514727423024037898/AjudaKael.png"

module.exports = class Ajuda extends Command {
  constructor (client) {
    super(client, {
      name: "help",
      aliases: ["ajuda", "ayuda"]
    })
  }

  run ({t, message, prefix}) {
    const embed = new Embed()
      .setAuthor(t("commands:help.embed.title"), this.client.user.displayAvatarURL)
      .addField(...t("commands:help.embed.admin", { prefix }))
      .addField(...t("commands:help.embed.staff", { prefix }))
      .addField(...t("commands:help.embed.util", { prefix }))
      .setThumbnail(imageURL)
      .setFooter(t("embeds:requestedBy", { tag: message.author.tag, id: message.author.id }))
    message.channel.send(embed)
  }
}
