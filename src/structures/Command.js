module.exports = class Command {
  constructor (client, options) {
    this.client = client

    this.name = options.name
    this.aliases = options.aliases || []

    this.userPerm = options.userPerm || []
    this.botPerm = options.botPerm || []

    this.devOnly = options.devOnly || false
    this.guildOwnerOnly = options.guildOwnerOnly || false
    this.dbOnly = options.dbOnly || false

    this.subCommands = []

    this.parentCommand = options.parentCommand
    this.category = options.category
  }

  async _run ({t, message, prefix}, args) {
    try {
      this.handleRequirements(t, message)
    } catch (e) {
      return console.error(`[Error] [Requirements] [${this.name}]`, e.message)
    }

    let [subCmd] = args
    let subCommand = this.subCommands.find(s => s.name === subCmd || s.aliases.includes(subCmd))
    if (subCommand) {
      return subCommand._run({t, message, prefix}, args)
    }

    try {
      await this.run({t, message, prefix}, args)
    } catch (e) {
      console.error(`[Error] [Run] [${this.name}]`, e)
    }
  }

  handleRequirements (t, m) {
    if (this.devOnly && !this.client.devs.includes(m.author.id)) {
      m.reply(t("errors:dev_only")).catch(()=>{})
      throw new Error("O usuário não faz parte dos desenvolvedores.")
    }

    if (this.guildOwnerOnly && m.guild.ownerID !== m.author.id) {
      m.reply(t("errors:owner_only", { name: this.name })).catch(()=>{})
      throw new Error("O membro não é o dono do servidor.")
    }

    if (!m.member.hasPermission(this.userPerm, false, true, true)) {
      const userPermString = translatePerm(t, this.userPerm).map(p => `\`${p}\``).join(", ")
      m.channel.send(t("errors:user_missing_perms", {
        command: t(`commands:${this.name}.name`),
        perms: userPermString,
        user: m.author.toString(),
        count: this.userPerm.length
      }))
      throw new Error("O membro não tem permissão para executar o comando.")
    }

    if (!m.guild.me.hasPermission(this.botPerm, false, true)) {
      const botPermString = translatePerm(t, this.botPerm).map(p => `\`${p}\``).join(", ")
      m.reply(t("errors:bot_missing_perms", { name: this.name, perms: botPermString }))
      throw new Error("O bot não tem as permissões necessárias para executar o comando.")
    }

    if (this.dOnly && (!this.client.db || !this.client.db.mongoose.connection)) {
      m.reply(t("errors:no_db_connection")).catch(()=>{})
      throw new Error("Sem conexão ao banco de dados de servidores.")
    }
  }

  async run () {}
}

/**
 * @param {Array<String>} permissions
 */
function translatePerm (t, permissions) {
  for (let i = 0; i < permissions.length; ++i) {
    permissions[i] = t(`permissions:${permissions[i]}`) || permissions[i]
  }

  return permissions
}
