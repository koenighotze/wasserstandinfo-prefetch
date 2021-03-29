const { stations: rawStations } = require('./test-fixtures/raw_stations')
const { any, objectContaining } = expect

describe('parsing the station data', () => {
  it('should extract uuid, station name and the water name', async () => {
    const parsed = require('./station-data').parseStationData(rawStations)

    expect(parsed).toHaveLength(rawStations.length)
    expect(parsed[0]).toMatchObject({
      uuid: any(String), name: any(String), water: any(String)
    })
  })
})

describe('storeStationData the station data', () => {
  const testBucketName = 'TESTBUCKET'
  const testStationsObjectKeyName = 'teststations.json'
  const stations = [{'uuid':'47174d8f-1b8e-4599-8a59-b580dd55bc87','name':'EITZE','water':'ALLER'}]

  let mockPutObject, mockPutObjectPromise, StationData
  
  beforeEach(() => {
    mockPutObject = jest.fn()
    mockPutObjectPromise = jest.fn().mockResolvedValue(true)
    mockPutObject.mockReturnValue({ promise: mockPutObjectPromise })
    jest.mock('aws-sdk', () => ({
      S3: function() {
        return ({
          putObject: mockPutObject
        })
      }
    }))
    StationData = require('./station-data')
  })

  it('should store the data in the right bucket', async () => {
    await StationData.storeStationData(stations, testBucketName, testStationsObjectKeyName)

    expect(mockPutObject).toHaveBeenCalledWith(objectContaining({
      Bucket: testBucketName,
      Key: testStationsObjectKeyName,
      Body: JSON.stringify(stations),
      Tagging: any(String)
    }))
  })

  it('should reject if the bucket name is unset', async () => {
    await expect(StationData.storeStationData(stations)).rejects.toThrowError()
  })

  it('should reject if storing to s3 failed', async () => {
    const error = new Error('bumm')
    mockPutObjectPromise.mockRejectedValue(error)
    
    await expect(StationData.storeStationData(stations, testBucketName, testStationsObjectKeyName)).rejects.toThrowError(error)
  })
})
