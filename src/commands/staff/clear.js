const { Command } = require("../../")

module.exports = class Clear extends Command {
  constructor (client) {
    super(client, {
      name: "clear",
      aliases: ["apagar"],
      userPerm: ["MANAGE_CHANNELS"],
      category: "staff"
    })
  }

  async run ({t, message}, args) {
    const USER = message.author.toString()
    const idRegex = /[0-9]{17, 18}/
    const [id] = idRegex.exec(args[0]) || []

    if (id) {
      let msg = message.channel.fetchMessage(id)
      if (msg)
        return msg.delete().then(() => message.channel.send(t("commands:clear.messageDeleted", { user: USER, id })))

      let channelMessages = await message.channel.fetchMessages({ limit: 100 })
      let userMessages = channelMessages.filter(m => m.author.id === id)
      if (userMessages.size) {
        const author = userMessages.first().author
        return message.channel.bulkDelete(userMessages)
          .then(() => message.channel.send(t("commands:clear.userBulkDelete", { user: USER, tag: author.tag })))
      }

      return message.channel.send(t("commands:clear.errors.invalidId", { user: USER }))
    }

    let quantity = Number(args[0])
    if (isNaN(quantity))
      return message.channel.send(t("commands:clear.errors.NaN", { user: USER }))
    quantity = Math.floor(quantity)

    const min = 2
    const max = 2000
    if (quantity < min || quantity > max)
      return message.channel.send(t("commands:clear.errors.sizeLimit", { user: USER, min, max }))

    let remaining = quantity
    let deleted = 0
    do {
      let deletedMessages = await message.channel.bulkDelete(Math.min(remaining, 100), true).catch(()=>{})
      if (!deletedMessages || deletedMessages.size === 0)
        break
      deleted += deletedMessages.size
      remaining -= deletedMessages.size
      if (remaining === 0)
        break
    } while (1)

    return message.channel.send(t("commands:clear.bulkDelete", { user: USER, count: deleted }))
  }
}
