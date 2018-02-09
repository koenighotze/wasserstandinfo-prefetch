const Lab = require('lab')
const lab = exports.lab = Lab.script()
const test = lab.test
const handler = require('../src/index').handler
const sinon = require('sinon')
const expect = require('chai').expect

const PegelOnline = require('../src/pegelOnline')
const StationData = require('../src/stationData')
const rawStations = require('./raw_stations').stations

lab.experiment('the function', () => {
  let sandbox

  lab.beforeEach( (done) => {
    sandbox = sinon.sandbox.create()

    done()
  })

  lab.afterEach( (done) => {
    sandbox.restore()

    done()
  })

  test('should direct fetch errors to the callback', (done) => {
    const expectedError = new Error('Bumm')

    sandbox.stub(PegelOnline, 'fetchStations')
      .callsArgWith(0, expectedError)

    const callback = (err, result) => {

      expect(result).to.be.undefined
      expect(err).to.be.eq(expectedError)

      done()
    }

    handler({}, {}, callback)
  })

  test('should store the station data to s3', (done) => {
    sandbox.stub(PegelOnline, 'fetchStations')
      .callsArgWith(0, null, rawStations)

    const fake = (stationdata) => {
      expect(stationdata).to.be.not.undefined
      expect(stationdata).to.be.of.length(rawStations.length)

      return Promise.resolve(stationdata)
    }

    sandbox.stub(StationData, 'storeStationData').callsFake(fake)

    handler({}, {}, (err, res) => { 
      expect(err).to.be.null
      expect(res).to.be.not.null

      done() 
    })
  })

  test('should direct s3 errors to the callback', (done) => {
    sandbox.stub(PegelOnline, 'fetchStations')
      .callsArgWith(0, null, rawStations)

    const error = new Error('boom') 
    
    const fake = (_) => {
      return Promise.reject(error)
    }

    sandbox.stub(StationData, 'storeStationData').callsFake(fake)

    handler({}, {}, (err, res) => { 
      expect(err).to.be.eq(error)
      expect(res).to.be.undefined

      done() 
    })
  })
})
