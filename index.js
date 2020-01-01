require("dotenv").config()

const { leaK } = require("./src")

const client = new leaK({
  disableEveryone: true,
  messageCacheLifetime: 600,
  messageSweepInterval: 600,
  disabledEvents: [
    "TYPING_START"
  ]
})

client.login()
