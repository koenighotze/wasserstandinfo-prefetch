const Lab = require('lab')
const lab = exports.lab = Lab.script()
const test = lab.test
const Wreck = require('wreck')

const rawStations = require('./raw_stations').stations
const expect = require('chai').expect
const sinon = require('sinon')

const fetchStations = require('../src/pegelOnline').fetchStations

lab.experiment('fetching the stations', () => {
  let sandbox

  lab.beforeEach((done) => {
    sandbox = sinon.sandbox.create()
    
    done()
  })

  lab.afterEach((done) => {
    sandbox.restore()
    done()
  })

  test('should return the payload as json', (done) => {
    sandbox.stub(Wreck, 'get').returns( Promise.resolve({ payload: JSON.stringify(rawStations) }) )

    const callback = (err, payload) => {
      expect(payload).to.be.of.length.greaterThan(0)
      expect(payload[0]).to.include.all.keys('uuid', 'shortname', 'water')
      done()
    }

    fetchStations(callback)
  })

  test('should fail on errors', (done) => {
    sandbox.stub(Wreck, 'get').returns( Promise.reject(new Error('Boom')) )

    const callback = (err, payload) => {
      expect(err).to.not.be.null
      expect(payload).to.be.undefined

      done()
    }

    fetchStations(callback)
  })
})