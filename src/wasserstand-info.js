const logger = require('bunyan').createLogger({ name: __filename })
const PegelOnline = require('./pegelOnline')
const StationData = require('./stationData')

const fetchCurrentWasserstand = async (uploadBucketName) => {
    logger.info('Updating local station data')
    const stations = await PegelOnline.fetchStations()

    logger.info('Storing stations to S3')
    return await StationData.storeStationData(StationData.parseStationData(stations), uploadBucketName)
}

module.exports = fetchCurrentWasserstand