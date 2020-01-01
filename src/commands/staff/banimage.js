const { Command } = require("../../")
const { isUri } = require("valid-url")
const extensions = /(?:.jpg|.gif|.png)$/

module.exports = class BanImage extends Command {
  constructor (client) {
    super(client, {
      name: "banimage",
      userPerm: ["BAN_MEMBERS"],
      dbOnly: true,
      category: "staff"
    })
  }

  async run ({t, message}, [url]) {
    let doc = await this.client.db.users.get(message.author.id)
    const USER = message.author.toString()

    if (!url) return message.channel.send(t("commands:banimage.errors.noArgs", { user: USER }))
    if (!isUri(url)) return message.channel.send(t("commands:banimage.errors.invalidUrl", { user: USER }))

    url = new URL(url)
    if (!extensions.test(url.pathname)) return message.channel.send(t("commands:banimage.errors.invalidExtension", { user: USER }))

    doc.ban_image = url.toString()

    await doc.save()

    message.channel.send(t("commands:banimage.imageAdded", { user: USER }))
  }
}
