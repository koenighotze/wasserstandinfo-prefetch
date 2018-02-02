const Wreck = require('wreck')

const fetchStations = function (callback) {
  const url = 'https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/'
  console.log('Fetching stations from ' + url)
  Wreck.get(url, { timeout: 2000 })
    .then( (res) => {
      callback(null, JSON.parse(res.payload))
    })
    .catch((error) => {
      console.log('Fetching failed with', error)
      callback(error)
    })
}

module.exports = {
  fetchStations
}

if (process.env.NODE_ENV === 'development') {
  fetchStations((err, events) => {
    if (err) {
      console.warn(err)
    }
    else {
      console.log(events)
    }
  })
}
