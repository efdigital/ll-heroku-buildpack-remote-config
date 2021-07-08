const path = require('path')
module.exports = {
  path: path.join(process.env.BUILD_DIR || '', '.heroku-buildpack-remote-config.json')
}