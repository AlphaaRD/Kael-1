const { Command, Embed } = require("../../")

module.exports = class RoleAll extends Command {
  constructor (client) {
    super(client, {
      name: "roleall",
      aliases: ["cargotodos"],
      userPerm: ["ADMINISTRATOR"],
      category: "admin"
    })
  }

  async run ({t, message}) {
    const USER = message.author.toString()
    const roles = message.mentions.roles

    if (!roles.size) return message.channel.send(t("commands:roleall.errors.noRoles", { user: USER }))
    if (roles.size > 5) return message.channel.send(t("commands:roleall.errorrs.rolesLimit", { user: USER }))

    let guild = message.guild.large ? await message.guild.fetchMembers() : message.guild
    let members = guild.members

    const time = 2 * members.size // * roles.size

    const embed = new Embed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .setTitle(t("commands:roleall.embed.title", { roles: roles.size, members: members.size }))
    .addField(...t("commands:roleall.embed.roles", { roles: roles.map(r => r.toString()).join(", ") }))
    .setFooter(t("commands:roleall.embed.estimatedTime", { count: time }))
    const m = await message.channel.send(embed)

    const emojis = ["✅", "❌"]
    for (let emoji of emojis) await m.react(emoji)

    const filter = (r, u) => emojis.includes(r.emoji.name) && u.id === message.author.id
    let reactions = await m.awaitReactions(filter, { time: 30000, max: 1, errors: ["time"] })
    let reaction = reactions.first()
    m.delete()

    if (reaction.emoji.name === "❌") return message.channel.send(t("commands:roleall.cancelled", { user: USER }))

    message.channel.send(t("commands:roleall.addingRoles", { user: USER }))

    for (let member of members.values()) {
      if (member.user.bot) continue
      await member.addRoles(roles.filter(r => !member.roles.get(r.id)))
      await this.sleep(2000)
    }

    message.channel.send(t("commands:roleall.done", { user: USER }))
  }

  sleep (time) {
    return new Promise((res) => setTimeout(res, time))
  }
}
