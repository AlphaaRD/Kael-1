const { Command, Embed } = require("../../")

module.exports = class Recruiter extends Command {
  constructor (client) {
    super(client, {
      name: "recruiters",
      aliases: ["recrutadores", "divulgadores"],
      category: "util"
    })
  }

  async run ({t, message}) {
    const guildInvites = await message.guild.fetchInvites()

    const inviters = new Map()

    let totalRecruited = 0
    let totalInvites = guildInvites.size

    for (let [, invite] of guildInvites) {
      totalRecruited += invite.uses
      let acc = (inviters.get(invite.inviter.id) || { uses: 0}).uses
      inviters.set(invite.inviter.id, { uses: invite.uses + acc, inviter: invite.inviter })
    }

    let topInviters = Array.from(inviters.values()).sort((a, b) => b.uses - a.uses).slice(0, 5)

    const embed = new Embed()
    .setAuthor(t("commands:recruiters.embed.title", { guildName: message.guild.name }), this.client.user.displayAvatarURL)
    .setDescription(t("commands:recruiters.embed.description"))
    .addField(...t("commands:recruiters.embed.totalRecruited", { totalRecruited }), true)
    .addField(...t("commands:recruiters.embed.totalInvites", { totalInvites }), true)
    .setFooter(t("embeds:requestedBy", message.author))

    for (let [i, invite] of topInviters.entries()) {
      const {inviter, uses} = invite
      const position = t(`commands:recruiters.embed.position_${i + 1}`)
      embed.setDescription(embed.description + "\n\n" + t("commands:recruiters.embed.inviter", { position, username: inviter.username, uses }))
    }

    message.channel.send(embed)
  }
}
