const Heroku = require('heroku-client')

const token = process.env.HEROKU_BUILDPACK_REMOTE_CONFIG_API_TOKEN
if (!token) {
  throw new Error("HEROKU_BUILDPACK_REMOTE_CONFIG_API_TOKEN is not set")
}

const heroku = new Heroku({ token })

const getAppConfigVars = app => heroku.get(`/apps/${app}/config-vars`)

const filterByKeys = (result, keys) => Object.keys(result).reduce((filtered, key) => {
  if (keys.contains(key)) {
    filtered[key] = result[key]
  }
  return filtered
}, {})

const unfiltered = (result => result)

const config = (apps, keys) => {
  return new Promise((resolve, reject) => {

    if (!Array.isArray(apps)) {
      reject(new Error("Invalid list of apps"))
    }

    if (!Array.isArray(keys)) {
      reject(new Error("Invalid list of keys"))
    }

    const filter = keys.contains('*') ? unfiltered : filterByKeys

    return Promise.all(apps.map(getAppConfigVars)).then(
      results => {
        const hash = results.reduce((hash, result, index) => {
          const app = apps[index]
          hash[app] = filter(result, keys)
          return hash
        }, {})
        resolve(hash)
      },
      reject
    )
  })
}

module.exports = {
  config
}