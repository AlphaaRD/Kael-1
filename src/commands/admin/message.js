const { Command, Embed } = require("../../")
const imageURL = "https://cdn.discordapp.com/attachments/507373669413027852/513196616262352908/mensagensK.png"

module.exports = class Message extends Command {
  constructor (client) {
    super(client, {
      name: "message",
      aliases: ["mensagem", "mensaje"],
      userPerm: ["ADMINISTRATOR"],
      category: "admin"
    })
  }

  async run ({t, message, prefix}) {
    const embed = new Embed()
      .setAuthor(t("commands:message.embed.title"), this.client.user.displayAvatarURL)
      .setDescription(t("commands:message.embed.description"))
      .addField(...t("commands:message.embed.join", { prefix }))
      .addField(...t("commands:message.embed.dm", { prefix }))
      .addField(...t("commands:message.embed.leave", { prefix }))
      .addField(...t("commands:message.embed.userCreatedAt"))
      .addField(...t("commands:message.embed.member"))
      .addField(...t("commands:message.embed.guildName"))
      .addField(...t("commands:message.embed.guildId"))
      .addField(...t("commands:message.embed.memberUsername"))
      .addField(...t("commands:message.embed.memberAvatar"))
      .addField(...t("commands:message.embed.memberId"))
      .addField(...t("commands:message.embed.deactivatedModule", { prefix }))
      .addField(...t("commands:message.embed.testModule", { prefix }))
      .setThumbnail(imageURL)
      .setFooter(t("embeds:requestedBy", { tag: message.author.tag, id: message.author.id }))
    return message.channel.send(embed)
  }
}
