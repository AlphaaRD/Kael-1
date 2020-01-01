const { Command, Embed } = require("../../")

module.exports = class Recruiter extends Command {
  constructor (client) {
    super(client, {
      name: "recruiter",
      aliases: ["recrutador", "divulgador"],
      category: "util"
    })
  }

  async run ({t, message}) {
    const member = message.mentions.members.first() || message.member

    let invites = await message.guild.fetchInvites()
    let memberInvites = []
    let inviteCount = 0
    invites.forEach(i => {
      if (i.inviter.id !== member.id) return
      inviteCount += i.uses
      memberInvites.push(i)
    })

    let inviteString = inviteCount
      ? memberInvites.map(i => `${i} - ${t("commands:recruiter.inviteInfo", { count: i.uses })}`).join("\n")
      : t("commands:recruiter.errors.noInvites", { tag: message.author.tag })

    const embed = new Embed()
      .setAuthor(t("commands:recruiter.embed.title"), this.client.user.displayAvatarURL)
      .addField(...t("commands:recruiter.embed.recruiterInfo", { tag: member.user.tag, count: inviteCount }))
      .addField(t("commands:recruiter.embed.invites"), inviteString)
      .setThumbnail(member.user.displayAvatarURL)
      .setFooter(t("embeds:requestedBy", { tag: message.author.tag, id: message.author.id }))
    message.channel.send(embed)
  }
}
