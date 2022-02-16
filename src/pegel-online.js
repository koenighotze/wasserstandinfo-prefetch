const axios = require('axios').default
const logger = require('bunyan').createLogger({ name: __filename })
const { stationsServiceUrl } = require('./config')

const fetchStations = async () => {
  logger.debug('Fetching stations from ' + stationsServiceUrl)

  const { data } = await axios.get(stationsServiceUrl, { timeout: 2000 })

  return data
}

module.exports = {
  fetchStations
}