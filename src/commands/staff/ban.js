const { Command, Embed } = require("../../")

module.exports = class Kick extends Command {
  constructor (client) {
    super(client, {
      name: "ban",
      userPerm: ["BAN_MEMBERS"],
      category: "staff"
    })
  }

  async run ({t, message}, [rawId, ...reason]) {
    const USER = message.author.toString()
    reason = reason.join(" ") || t("constants:noReason")
    const idRegex = /[0-9]{17,18}/
    const [userId] = idRegex.exec(rawId) || []

    if (!userId) return message.channel.send(t("commands:ban.errors.noArgs", { user: USER }))

    const user = await this.client.fetchUser(userId).catch(()=>{})
    const member = await message.guild.fetchMember(user.id).catch(()=>{})

    if (!user) return message.channel.send(t("commands:ban.errors.userNotFound", { user: USER }))

    if (member) {
      const ownerID = message.guild.ownerID
      const isExecutorOwner = message.author.id === ownerID
      const isExecutorRoleHigher = message.member.highestRole.comparePositionTo(member.highestRole) > 0
      const isMemberOwner = member.id === ownerID

      if (!isExecutorOwner && (isMemberOwner || !isExecutorRoleHigher))
        return message.channel.send(t("commands:ban.errors.userMissingPerm", { user: USER }))

      if (!member.kickable)
        return message.channel.send(t("commands:ban.errors.botMissingPerm", { user: USER }))
    }

    await message.guild.ban(user, { reason })

    const banImage = await this.getBanImage(message.author.id)

    const embed = new Embed()
    .setAuthor(t("commands:ban.embed.title"), this.client.user.displayAvatarURL)
    .setDescription(t("commands:ban.embed.description", { executor: USER, kicked: user.toString() }))
    .addField(...t("commands:ban.embed.user", { tag: user.tag }), true)
    .addField(...t("commands:ban.embed.id", { id: user.id }), true)
    .addField(...t("commands:ban.embed.reason", { reason }))
    .setThumbnail(user.displayAvatarURL)
    .setImage(banImage)
    .setFooter(t("commands:ban.embed.footer"))
    message.channel.send(embed)
  }

  async getBanImage (id) {
    if (!this.client.db || !this.client.db.mongoose.connection) return ""
    let doc = await this.client.db.users.get(id, { ban_image: 1 }, { lean: true })
    return doc.ban_image
  }
}
