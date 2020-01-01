const { Command } = require("../../")

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, {
      name: "ping",
      category: "util"
    })
  }

  async run ({_, message}) {
    const ping = Math.round(this.client.ping)

    message.channel.send(`Pong! \`${ping}ms\``)
  }
}
