const fs = require('fs')
const { log, verbose } = require('./lib/logging')
const { path } = require('./lib/file')

log('delete config values file')
if (fs.existsSync(path)) {
  verbose(`deleting config file: ${path}`)
  fs.unlinkSync(path)
  verbose(`deleted config file: ${path}`)
  process.exit(0)
} else {
  verbose(`config file does not exist: ${path}`)
  process.exit(1)
}
