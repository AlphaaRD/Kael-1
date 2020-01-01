const { Command, Embed } = require("../../")

module.exports = class Lang extends Command {
  constructor (client) {
    super(client, {
      name: "lang",
      aliases: ["language", "língua", "linguagem", "lengua", "lenguaje"],
      userPerm: ["ADMINISTRATOR"],
      dbOnly: true,
      category: "admin"
    })
  }

  async run ({t, message}) {
    let doc = await this.client.db.guilds.get(message.guild.id, { lang: 1 })

    const flags = ["🇧🇷", "🇺🇸"]

    const embed = new Embed()
    .setTitle(t("commands:lang.embed.title"))
    .addField(t("commands:lang.embed.available"),
      `🇧🇷 **Português do Brasil**\n` +
      `🇺🇸 **English**`
    )
    .setFooter(t("embeds:requestedBy", { tag: message.author.tag, id: message.author.id }))

    const m = await message.channel.send(embed)

    for (let flag of flags) {
      await m.react(flag)
    }

    let reactions
    try {
      const filter = (r, u) => flags.includes(r.emoji.name) && u.id === message.author.id
      reactions = await m.awaitReactions(filter, { time: 60000, max: 1 })
    } catch (e) {
      return console.error("[Error] [Lang]", e)
    }

    const reaction = reactions.first()
    if (!reaction) return

    m.delete()

    switch (reaction.emoji.name) {
    case "🇧🇷":
      doc.lang = "pt-BR"
      break
    case "🇺🇸":
      doc.lang = "en-US"
      break
    }

    await doc.save()

    const newT = this.client.i18n.getFixedT(doc.lang)

    message.channel.send(newT("commands:lang.languageChanged", { user: message.author.toString() }))
  }
}
