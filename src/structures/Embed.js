const { RichEmbed } = require("discord.js")
const defaultColor = "DA0E3B"

module.exports = class Embed extends RichEmbed {
  constructor (options) {
    super(options)

    this.setColor(defaultColor)
  }
}
