const fs = require('fs')
const { log, verbose } = require('../lib/logging')
const { path } = require('../lib/file')

log('tidying up config values')
if (fs.existsSync(path)) {
  verbose(`deleting config from ${path}`)
  fs.unlinkSync(path)
} else {
  verbose(`config file does not exist ${path}`)
}