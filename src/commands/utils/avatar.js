const { Command, Embed } = require("../../")

module.exports = class Avatar extends Command {
  constructor (client) {
    super(client, {
      name: "avatar",
      category: "util"
    })
  }

  async run ({t, message}, [id]) {
    let user = message.mentions.users.first() || await this.client.fetchUser(id, false).catch(()=>{}) || message.author
    let avatar = user.displayAvatarURL
    if (!avatar.endsWith("?size=2048")) avatar += "?size=2048"
    let embed = new Embed()
      .setDescription(t("commands:avatar.embed.description", { user: user.toString() }))
      .setImage(avatar)
    message.channel.send(embed)
  }
}
