const { Command, Embed } = require("../../")
const imageUrl = "https://cdn.discordapp.com/attachments/507373669413027852/511041595072577566/castle_1.png"

module.exports = class Security extends Command {
  constructor (client) {
    super(client, {
      name: "security",
      aliases: ["defesa"],
      userPerm: ["ADMINISTRATOR"],
      category: "staff"
    })
  }

  async run ({t, message, prefix}) {
    const embed = new Embed()
    .setAuthor(t("commands:security.embed.title", { prefix }), this.client.user.displayAvatarURL)
    .addField(...t("commands:security.embed.learnMore", { prefix }))
    .addField(...t("commands:security.embed.capslock", { prefix }))
    .addField(...t("commands:security.embed.apng", { prefix }))
    .addField(...t("commands:security.embed.invite", { prefix }))
    .addField(...t("commands:security.embed.spam", { prefix }))
    .addField(...t("commands:security.embed.bots", { prefix }))
    .setThumbnail(imageUrl)
    message.channel.send(embed)
  }
}
