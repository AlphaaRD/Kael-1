const { Command, Embed } = require("../../")
const imageURL = "https://cdn.discordapp.com/attachments/507373669413027852/517100928118030348/CargoK.png"

module.exports = class Autorole extends Command {
  constructor (client) {
    super(client, {
      name: "autorole",
      aliases: ["autocargo"],
      userPerm: ["ADMINISTRATOR"],
      category: "admin"
    })
  }

  async run ({t, message, prefix}, args) {
    if (!args.length) {
      const embed = new Embed()
      .setAuthor(t("commands:autorole.embed.title"), this.client.user.displayAvatarURL)
      .addField(...t("commands:autorole.embed.description", { prefix }))
      .addField(...t("commands:autorole.embed.remove", { prefix }))
      .setThumbnail(imageURL)
      .setFooter(t("embeds:requestedBy", { tag: message.author.tag, id: message.author.id }))
      return message.channel.send(embed)
    }

    let doc = await this.client.db.guilds.get(message.guild.id, { autorole_roles: 1 })

    let mentionedRoles = this.getMentionedRoles(message, doc.autorole_roles).filter(id => !doc.autorole_roles.includes(id))

    if (!mentionedRoles.length)
      return message.channel.send(t("commands:autorole.errors.invalidRoles", { user: message.author.toString() }))

    if (!mentionedRoles.length)
      return message.channel.send(t("commands:autorole.errors.rolesAlreadyAdded", { user: message.author.toString() }))

    if (doc.autorole_roles.length + mentionedRoles.length > 5)
      return message.channel.send(t("commands:autorole.errors.reachedLimit", { user: message.author.toString() }))

    if (mentionedRoles.length > 5)
      return message.channel.send(t("commands:autorole.errors.setLimit", { user: message.author.toString() }))

    doc.autorole_roles.push(...mentionedRoles)

    await doc.save()

    const addedRoles = mentionedRoles.map(r => `<@&${r}>`).join(", ")
    message.channel.send(t("commands:autorole.add", { user: message.author.toString(), roles: addedRoles, count: mentionedRoles.length }))
  }

  getMentionedRoles (m) {
    const roles = new Set()
    const roleIdRegex = /[0-9]{18}/

    m.content.split(/ +/g).map(chunk => {
      let [roleId] = roleIdRegex.exec(chunk) || [null]
      if (roleId && m.guild.roles.has(roleId)) roles.add(roleId)
    })

    return Array.from(roles)
  }
}
