const PegelOnline = require('./pegelOnline')
const StationData = require('./stationData')

exports.handler = (event, context, callback) => {
  console.log('Updating local station data')
  PegelOnline.fetchStations( (err, stations) => {
    if (err) {
      console.log('Cannot fetch stations!', err)
      callback(err)
    }
    else {
      console.log('Storing stations to S3')
      StationData.storeStationData(StationData.parseStationData(stations)).then((result) => callback(null, result)).catch((err) => callback(err))
    }
  })
}
