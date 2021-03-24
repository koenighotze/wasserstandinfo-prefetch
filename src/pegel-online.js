const axios = require('axios').default
const logger = require('bunyan').createLogger({ name: __filename })

const fetchStations = async () => {
  const url = 'https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/'
  logger.debug('Fetching stations from ' + url)

  const { data } = await axios.get(url, { timeout: 2000 })

  return data
}

module.exports = {
  fetchStations
}