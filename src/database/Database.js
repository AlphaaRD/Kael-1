const mongoose = require("mongoose")
const Model = require("./Model.js")
const Schemas = require("./Schemas.js")

module.exports = class GuildDatabase {
  constructor(DB_URI) {
    this.DB_URI = DB_URI

    this.mongoose = mongoose
  }

  get (id) {
    if (typeof id !== "string")
      throw new TypeError("id must be String")
    return this.guilds.get(id)
  }

  connect () {
    return new Promise((resolve, reject) => {
      this.mongoose
        .connect(this.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => this.loadModels(Schemas))
        .then(() => resolve())
        .catch(reject)
    })
  }

  loadModels (schemas) {
    return new Promise((resolve, reject) => {
      if (typeof schemas !== "object")
        reject(new TypeError("`schemas` must be an object"))

      let keys = Object.keys(schemas)

      if (!keys.length) reject()

      for (let i = 0; i < keys.length; ++i) {
        let model = this.mongoose.model
        let schemaName = keys[i]
        this[schemaName] = new Model(model, schemaName, schemas[schemaName])
      }

      resolve()
    })
  }
}
