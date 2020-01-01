const { Client } = require("discord.js")

const { promisify } = require("util")
const glob = promisify(require("glob"))
const { join } = require("path")

const i18next = require("i18next")
const Backend = require("i18next-node-fs-backend")

const { prefix, devs } = require("./config.json")

const isConstructor = f => {
  try {
    new f()
  } catch (e) {
    return false
  }
  return true
}

const { Listener, Command }  = require("./structures")
const { Database } = require("./database")

module.exports = class Masterpiece extends Client {
  constructor (options) {
    super(options)

    this.loadListeners("./listeners")

    this.commands = []
    this.subCommands = []
    this.loadCommands("./commands/")

    this.db = null
    this.loadDB(process.env.db_uri)

    this.t = null
    this.loadLocales()
  }

  async loadLocales () {
    const locales = await glob("*/", { cwd: join(__dirname, "locales") })
      .then(ll => ll.map(l => l.slice(0, -1)))
    const i18nextOptions = {
      backend: {
        loadPath: "src/locales/{{lng}}/{{ns}}.json"
      },
      ns: ["commands", "embeds", "errors", "permissions", "constants", "security", "emojis"],
      preload: locales,
      returnObjects: true
    }

    await i18next.use(Backend).init(i18nextOptions).catch(console.error)

    i18next.languages = locales
    this.i18n = i18next
  }

  get prefix () { return prefix; }

  get devs () { return devs; }

  loadDB (uri) {
    this.db = new Database(uri)
    this.db.connect()
      .then(() => console.log("Conectado à DB."))
      .catch(e => {
        console.error("[Error] [DB_loading]", e.message)
        this.db = null
      })
  }

  login (token = process.env.token) {
    return super.login(token)
  }

  async loadListeners (path) {
    path = join(__dirname, path)

    let files
    try {
      files = await glob("**/*.js", { cwd: path, nodir: true })
    } catch (e) {
      return console.error("[Error] [Listener_loading]", e)
    }

    let loaded = 0
    for (let file of files) {
      loaded += this.loadListener(join(path, file))
    }

    console.log(`${loaded} listeners carregados e ${files.length - loaded} listeners falharam em carregar.`)
  }

  loadListener (path) {
    const exported = require(path)
    delete require.cache[require.resolve(path)]

    if (typeof exported !== "function") return 0
    if (!isConstructor(exported)) return 0

    const newListener = new exported(this)
    if (!(newListener instanceof Listener)) return 0

    for (let [name, entry] of Object.entries(newListener.events)) {
      if (!entry.pop)
        entry = [entry]

      const functions = entry

      for (let _function of functions)
        this.on(name, _function.bind(newListener))
    }

    return 1
  }

  async loadCommands (path) {
    path = join(__dirname, path)

    let files
    try {
      files = await glob("**/*.js", { cwd: path, nodir: true })
    } catch (e) {
      return console.error("[Error] [Command_loading]", e)
    }

    let commandsLoaded = 0
    for (let file of files) {
      commandsLoaded += this.loadCommand(join(path, file))
    }

    let subCommandsLoaded = 0
    for (let subCommand of this.subCommands) {
      subCommandsLoaded += this.loadSubCommand(subCommand)
    }

    console.log(`${commandsLoaded} comandos carregados e ${subCommandsLoaded} subcomandos carregados.\n${files.length - (commandsLoaded + subCommandsLoaded)} falharam em carregar.`)
  }

  loadCommand (path) {
    const exported = require(path)
    delete require.cache[require.resolve(path)]

    if (typeof exported !== "function") return 0
    if (!isConstructor(exported)) return 0

    const newCommand = new exported(this)
    if (!(newCommand instanceof Command)) return 0

    if (newCommand.parentCommand) {
      this.subCommands.push(newCommand)
      return 0
    }

    this.commands.push(newCommand)

    return 1
  }

  loadSubCommand (cmd) {
    let parent = this.commands.find(c => c.name === cmd.parentCommand || c.aliases.includes(cmd.parentCommand))

    if (!parent) return 0

    parent.subCommands.push(cmd)

    return 1
  }
}
