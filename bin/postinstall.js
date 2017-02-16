const co = require('co')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const thunkify = require('thunkify')

require('../common/promise-extend')

const CFG_PATH = path.join(__dirname, '..', 'configs', 'global.json')
const HELP_MSG = [
  'This utility will walk you through creating a configs/global.json file.',
  'Press ^C to abort at any time so as to create manually.'
].reduce((prev, curr) => prev + curr + '\n', '')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const readFile = thunkify(fs.readFile)
const writeFile = thunkify(fs.writeFile)
const question = thunkify((query, callback) => 
  // normalize callback function for thunkification
  rl.question(query, (answer) => callback(null, answer))
)

console.log(HELP_MSG)
co(function* () {
  let cfg = JSON.parse(yield readFile(CFG_PATH))
  cfg.db = cfg.db || {}
  cfg.db.url = (yield question('Database URL: (mongodb://localhost:27017) ')) || 'mongodb://localhost:27017'
  cfg.db.options = cfg.db.option || {}
  cfg.db.options.db = (yield question('Database name: (usay) ')) || 'usay'
  cfg.db.options.user = yield question('Database username: ')
  cfg.db.options.pass = yield question('Database password: ')

  yield writeFile(CFG_PATH, JSON.stringify(cfg, null, 2))
})
  .then(null, console.log)
  .finally(() => {
    rl.close()
  })
  .catch(console.log)
