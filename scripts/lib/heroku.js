const Heroku = require('heroku-client')
const { log, verbose } = require('./logging')

const token = process.env.HEROKU_BUILDPACK_REMOTE_CONFIG_API_TOKEN
if (!token) {
  throw new Error("HEROKU_BUILDPACK_REMOTE_CONFIG_API_TOKEN is not set")
}

const heroku = new Heroku({ token })

const getAppConfigVars = app => {
  const path = `/apps/${app}/config-vars`
  verbose(path)
  return heroku.get(path)
}

const filterByKeys = (result, keys) => Object.keys(result).reduce((filtered, key) => {
  if (keys.some(k => k === key)) {
    verbose(`exporting ${key}`)
    filtered[key] = result[key]
  } else {
    verbose(`skipping ${key}`)
  }
  return filtered
}, {})

const unfiltered = (result => {
  Object.keys(result).forEach(key => verbose(`exporting ${key}`))
  return result
})

const config = (apps, keys) => {
  log("getting config from heroku")
  return new Promise((resolve, reject) => {

    if (!Array.isArray(apps)) {
      verbose("Invalid list of apps")
      return reject(new Error("Invalid list of apps"))
    }

    if (!Array.isArray(keys)) {
      verbose("Invalid list of keys")
      return reject(new Error("Invalid list of keys"))
    }

    const filter = keys.some(k => k === '*') ? unfiltered : filterByKeys

    log("calling heroku api")
    const promises = apps.map(getAppConfigVars)

    return Promise.all(promises)
    .then(results => {
      verbose("values retrieved")
      const hash = results.reduce((hash, result, index) => {
        const app = apps[index]
        log(`values for app: ${app}`)
        hash[app] = filter(result, keys)
        return hash
      }, {})
      return resolve(hash)
    })
    .catch(error => {
      verbose("error getting values from heroku")
      return reject(error)
    })
  })
}

module.exports = {
  config
}