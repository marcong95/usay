const co = require('co')
const readline = require('readline')
const config = require('../configs/global')
const db = require('../models/db')
const User = require('../models/user')

require('../common/promise-extend')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Running this program will DROP database `usay` in the MongoDB ' + 
  'located at ' + config.db.url + ' and insert test data, which may cause ' + 
  'PERMANENT DATA LOSS. Input AGREE to continue or any other word to abort: ', 
  (answer) => {
  if (answer === 'AGREE') {
    co(function*() {
      yield db.dropDatabase()
      let lucio = yield User.register('lucio', 'DropTheBeat')
      yield lucio.modify('bio', 'Oh, let\'s break it down! !')
      let reinhardt = yield User.register('reinhardt', 'HammerDown')
      yield reinhardt.modify('bio', 'Ah, get behind me!')
      let junkrat = yield User.register('junkrat', 'FireInTheHole')
      yield junkrat.modify('bio', 'Ladies and gentlemen, start your engine!')
    }).then((res) => {
      console.log('Operation succeeded' + 
        (res ? 'with result ' + res : '') + '.')
    }, (err) => {
      console.log('Operation failed with error' + err)
    }).finally(() => db.close())
  } else {
    console.log('Operation aborted.')
    db.close()
  }
  rl.close()
})