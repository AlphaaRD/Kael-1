const { Command, Embed } = require("../../")

module.exports = class Kick extends Command {
  constructor (client) {
    super(client, {
      name: "kick",
      userPerm: ["KICK_MEMBERS"],
      category: "staff"
    })
  }

  async run ({t, message}, [rawId, ...reason]) {
    const USER = message.author.toString()
    reason = reason.join(" ") || t("constants:noReason")
    const idRegex = /[0-9]{17,18}/
    const [memberId] = idRegex.exec(rawId) || []

    const member = await message.guild.fetchMember(memberId).catch(()=>{})

    if (!member) return message.channel.send(t("commands:kick.errors.noArgs", { user: USER }))

    const ownerID = message.guild.ownerID
    const isExecutorOwner = message.author.id === ownerID
    const isExecutorRoleHigher = message.member.highestRole.comparePositionTo(member.highestRole) > 0
    const isMemberOwner = member.id === ownerID

    if (!isExecutorOwner && (isMemberOwner || !isExecutorRoleHigher))
      return message.channel.send(t("commands:kick.errors.userMissingPerm", { user: USER }))

    if (!member.kickable)
      return message.channel.send(t("commands:kick.errors.botMissingPerm", { user: USER }))

    await member.kick(reason)

    const embed = new Embed()
    .setAuthor(t("commands:kick.embed.title"), this.client.user.displayAvatarURL)
    .setDescription(t("commands:kick.embed.description", { executor: USER, kicked: member.toString() }))
    .addField(...t("commands:kick.embed.user", { tag: member.user.tag }), true)
    .addField(...t("commands:kick.embed.id", { id: member.id }), true)
    .addField(...t("commands:kick.embed.reason", { reason }), true)
    .setThumbnail(member.user.displayAvatarURL)
    message.channel.send(embed)
  }
}
