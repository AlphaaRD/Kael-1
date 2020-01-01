function setDefaultValues (schema) {
  let obj = {}
  for (let propertyName in schema.obj) {
    let property = schema.obj[propertyName]

    if (property.default !== undefined) {
      obj[propertyName] = property.default
    } else {
      const arr = [
        [ String, Number, Boolean, Map ],
        [ "",     0,      false,   new Map() ]
      ]

      const match = arr[0].indexOf(property.type)
      obj[propertyName] = arr[1][match]
    }
  }
  return obj
}

module.exports = class Model {
  constructor(model, name, schema) {
    this.model = model(name, schema)

    this.parse = this.parse.bind(this)

    this.defaultValues = {}
    this.defaultValues = setDefaultValues(schema)
  }

  parse (entity) {
    if (!entity) return null
    entity._doc
      ? (entity._doc = { ...this.defaultValues, ...entity._doc })
      : (entity = { ...this.defaultValues, ...entity })
    return entity
  }

  add (entity, options) {
    return this.model.create(entity).then(doc => {
      if (options.lean) doc = doc._doc
      return this.parse(doc)
    })
  }

  create () {
    return this.model.create(...arguments)
  }

  get (_id, projections = {}, options = {}) {
    return this.model
      .findById(_id, projections, options)
      .then(this.parse)
      .then(doc => doc || this.add({ _id }, options))
  }

  getAndUpdate (_id, update, options = { upsert: true }) {
    return this.model.findByIdAndUpdate(_id, update, options)
  }

  getAndDelete (_id) {
    return this.model.findByIdAndDelete(_id)
  }

  async findAll (conditions = {}, projections = {}) {
    return await this.model
      .find(conditions, projections)
      .then(doc => doc.map(this.parse))
  }
}
