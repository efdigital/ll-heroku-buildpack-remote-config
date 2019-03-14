const fs = require('fs')
const { log, verbose } = require('./lib/logging')
const { path } = require('./lib/file')
const heroku = require('./lib/heroku')

const apps = function (list) {
  if (!list || !list.length) {
    return []
  } else {
    return list.split(';')
  }
}(process.env.HEROKU_BUILDPACK_REMOTE_CONFIG_APPS)

const keys = function (list) {
  if (!list || !list.length) {
    return ['*']
  } else {
    return list.split(';')
  }
}(process.env.HEROKU_BUILDPACK_REMOTE_CONFIG_KEYS)

log('exporting config values')
verbose(`apps: ${apps}`)
verbose(`keys: ${keys}`)

heroku.config(apps, keys).then(config => {
  verbose(`writing config to ${path}`)
  fs.writeFileSync(path, JSON.stringify(config, null, 2), { encoding: 'utf8' })
  process.exit(0)
}, error => {
  verbose(`error getting config: ${JSON.stringify(error)}`)
  fs.writeFileSync(path, JSON.stringify({ error }, null, 2), { encoding: 'utf8' })
  process.exit(1)
})