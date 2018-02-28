
global.lambdaContainerId = require('uuid4')()
console.log('Setting up fresh instance', global.lambdaContainerId)

const PegelOnline = require('./src/pegelOnline')
const StationData = require('./src/stationData')
const Util = require('util')

exports.handler = (event, context, callback) => {
  console.log('Received ', Util.inspect(event))
  console.log('Context ', Util.inspect(context))
  console.log('Running as function', global.lambdaContainerId)

  console.log('Updating local station data')
  PegelOnline.fetchStations( (err, stations) => {
    if (err) {
      console.log('Cannot fetch stations!', err)
      callback(err)
    }
    else {
      console.log('Storing stations to S3')
      StationData.storeStationData(StationData.parseStationData(stations))
        .then((result) => callback(null, result))
        .catch((err) => callback(err))
    }
  })
}
