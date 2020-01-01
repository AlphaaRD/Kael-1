const { Command } = require("../../")

module.exports = class AutoroleRemove extends Command {
  constructor (client) {
    super(client, {
      name: "remove",
      aliases: ["remover"],
      userPerm: ["ADMINISTRATOR"],
      parentCommand: "autorole"
    })
  }

  async run ({t, message}) {
    let doc = await this.client.db.guilds.get(message.guild.id, { autorole_roles: 1 })

    let mentionedRoles = this.getMentionedRoles(message, doc.autorole_roles)

    if (!mentionedRoles.length)
      return message.channel.send(t("commands:autorole.errors.invalidRoles", { user: message.author.toString() }))

    if (mentionedRoles.length > 5)
      return message.channel.send(t("commands:autorole.errors.removeLimit", { user: message.author.toString() }))

    for (let i = 0; i < doc.autorole_roles.length; ++i)
      if (mentionedRoles.includes(doc.autorole_roles[i]))
        doc.autorole_roles.splice(i--, 1)

    await doc.save()

    const addedRoles = mentionedRoles.map(r => `<@&${r}>`).join(", ")
    message.channel.send(t("commands:autorole.remove", { user: message.author.toString(), roles: addedRoles, count: mentionedRoles.length }))
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
