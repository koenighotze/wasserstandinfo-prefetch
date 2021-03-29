require('dotenv').config()

global.lambdaContainerId = require('uuid/v4')()
const logger = require('bunyan').createLogger({ name: __filename })
logger.info('Setting up fresh instance', global.lambdaContainerId)

const fetchCurrentWasserstand = require('./src/wasserstand-info')

exports.handler = async () => {
  logger.debug('Running as function', global.lambdaContainerId)

  return await fetchCurrentWasserstand(process.env.UPLOAD_BUCKET_NAME, process.env.STATIONS_OBJECT_KEY_NAME)
}
