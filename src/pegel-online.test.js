const rawStations = require('./test-fixtures/raw_stations').stations
const { any, objectContaining } = expect

describe('fetching the stations', () => {
  const mockUrl = 'https://someurl'
  let fetchStations, mockGet

  beforeEach(() => {
    jest.mock('./config', () => ({
      stationsServiceUrl: mockUrl
    }))
    mockGet = jest.fn()
    jest.mock('axios', () => ({
      default: {
        get: mockGet
      }
    }))
    fetchStations = require('./pegel-online').fetchStations
  })

  it('should fetch the stations from the REST endpoint', async () => {
    mockGet.mockResolvedValue({ data: rawStations })

    await fetchStations()

    expect(mockGet).toHaveBeenCalledWith(mockUrl, objectContaining({
      timeout: any(Number)
    }))
  })

  it('should return the payload as json', async () => {
    mockGet.mockResolvedValue({ data: rawStations })

    const payload = await fetchStations()

    expect(payload.length).toBeGreaterThan(0)
    expect(payload[0]).toMatchObject({
      uuid: any(String),
      shortname: any(String),
      water: any(Object)
    })
  })

  describe('and fetching fails', () => {
    it('should throw', async () => {
      const bumm = new Error('bumm')
      mockGet.mockRejectedValue(bumm)

      await expect(fetchStations()).rejects.toThrowError(bumm)
    })
  })
})