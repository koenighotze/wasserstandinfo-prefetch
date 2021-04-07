const logger = require('bunyan').createLogger({ name: __filename })
const PegelOnline = require('./pegel-online')
const StationData = require('./station-data')

const fetchCurrentWasserstand = async (uploadBucketName, stationsObjectKeyName) => {
    logger.info('Updating local station data')
    const stations = await PegelOnline.fetchStations()

    logger.info('Storing stations to S3')
    return await StationData.storeStationData(StationData.parseStationData(stations), uploadBucketName, stationsObjectKeyName)
}

module.exports = fetchCurrentWasserstand