const { Command, Embed } = require("../../")
const images = new Map([
  ["admin", "https://cdn.discordapp.com/attachments/507373669413027852/510984836740153344/gears_1.png"],
  ["staff", ""],
  ["util", "https://cdn.discordapp.com/attachments/507373669413027852/513435633880924160/InforK.png"]
])

module.exports = class HelpAdmin extends Command {
  constructor (client) {
    super(client, {
      name: "admin",
      aliases: ["staff", "util"],
      parentCommand: "help"
    })
  }

  run ({t, message, prefix}, [type]) {
    let description = t(`commands:help.subCommands.${type}.sent`)

    const svEmbed = new Embed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .setDescription(description)

    const dmEmbed = new Embed()
    .setAuthor(t(`commands:help.subCommands.${type}.embed.title`), this.client.user.displayAvatarURL)
    .setThumbnail(images.get(type))

    let typeCommands = this.client.commands.filter(c => c.category === type)
    for (let command of typeCommands) {
      const commandName = t(`commands:${command.name}.name`)
      let args = t(`commands:${command.name}.arguments`)
      if (args === `${command.name}.arguments`) args = ""
      const description = t(`commands:${command.name}.description`)
      dmEmbed.addField(`${prefix}${commandName} ${args}`, description)
    }

    message.author.send(dmEmbed).then(() =>
      message.channel.send(svEmbed).then(m => m.delete(5000)).catch(()=>{})
    ).catch(() => message.channel.send(t("commands:help.errors.dmBlocked", { user: message.author.toString() })))
  }
}
