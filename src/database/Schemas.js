const { Schema } = require("mongoose")

const TransgressorSchema = new Schema({
  _id: { type: String },

  infractions: { type: Number, default: 0 }
})

const GuildSchema = new Schema({
  _id: { type: String },

  autorole_roles: [],
  
  transgressors: [TransgressorSchema],
  
  sec_apng: { type: Boolean, default: false},
  
  sec_invite: { type: Boolean, default: false },
  
  sec_spam: { type: Boolean, default: false },
  
  sec_bots: { type: Boolean, default: false },
  
  sec_capslock: { type: Boolean, default: false },
  
  sec_capslock_percentage: { type: Number, default: 100 },
  
  welcome_channel: { type: String, default: "" },
  
  welcome_message: { type: String, default: "" },
  
  leave_channel: { type: String, default: "" },
  
  leave_message: { type: String, default: "" },
  
  welcome_dm: { type: String, default: "" },

  prefix: { type: String, default: "-" },
  
  lang: { type: String, default: "pt-BR" }
})

const UserSchema = new Schema({
  _id: { type: String },
  
  ban_image: { type: String, default: "" }
})

module.exports = {
  guilds: GuildSchema,
  users: UserSchema
}
