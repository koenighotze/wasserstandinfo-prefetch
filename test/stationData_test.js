const Lab = require('lab')
const lab = exports.lab = Lab.script()
const test = lab.test
const rawStations = require('./raw_stations').stations
const expect = require('chai').expect
const sinon = require('sinon')

lab.experiment('parsing the station data', () => {
  const StationData = require('../src/stationData')

  test('should extract uuid, station name and the water name', (done) => {
    const parsed = StationData.parseStationData(rawStations)

    expect(parsed).to.have.lengthOf(rawStations.length)
    expect(parsed[0]).to.have.all.keys('uuid', 'name', 'water')

    done()
  })
})

lab.experiment('storeStationData the station data', () => {
  const stations = [{'uuid':'47174d8f-1b8e-4599-8a59-b580dd55bc87','name':'EITZE','water':'ALLER'}]
  const sandbox = sinon.sandbox.create()
  const proxyquire = require('proxyquire')
  const s3 = { 'putObject': () => {} }
  const StationData = proxyquire('../src/stationData', { 
    'aws-sdk': { 
      'S3': function () {
        return s3
      }
    } 
  })

  var putObjectStub

  lab.afterEach( (done) => {
    putObjectStub.restore()
    done()
  })

  test('should store the data in the right bucket', () => {
    putObjectStub = sandbox.stub(s3, 'putObject').callsFake((params, callback) => {
      expect(params.Bucket).to.be.eql('dschmitz.wasserstandsinfo')
      expect(params.Key).to.be.eql('stations.json')

      callback(null, 'ok')
    })

    return StationData.storeStationData(stations)
  })
  
  test('should tag the s3 bucket', () => {
    putObjectStub = sandbox.stub(s3, 'putObject').callsFake((params, callback) => {
      expect(params.Tagging).to.be.contain('CostCenter=TECCO')

      callback(null, 'ok')
    })

    return StationData.storeStationData(stations)
  })

  test('should reject if storing to s3 failed', (done) => {
    const error = new Error('Boom')
    putObjectStub = sandbox.stub(s3, 'putObject').callsFake((params, callback) => {
      callback(error)
    })
    
    StationData.storeStationData(stations).catch(err => {
      expect(err).to.be.eql(error)
      done()
    })
  })

  test('should resolve if storing to s3 succeeded', () => {
    const s3result = 'Success'
    putObjectStub = sandbox.stub(s3, 'putObject').callsFake((params, callback) => {
      callback(null, s3result)
    })

    return StationData.storeStationData(stations).then(result => expect(result).to.be.eql(s3result))
  })
})
