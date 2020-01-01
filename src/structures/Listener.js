module.exports = class Listener {
  constructor (client) {
    this.client = client
    this.events = {}
  }
}
