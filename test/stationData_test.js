const Lab = require('lab')
const lab = exports.lab = Lab.script()
const test = lab.test

lab.experiment('parsing the station data', () => {
  test('should extract uuid, station name and the water name', (done) => {
    done()
  })
})

lab.experiment('storeStationData the station data', () => {
  test('should store the data in the right bucket', (done) => {
    done()
  })
  
  test('should tag the s3 bucket', (done) => {
    done()
  })

  test('should reject if storing to s3 failed', (done) => {
    done()
  })

  test('should resolve if storing to s3 succeeded', (done) => {
    done()
  })
})
