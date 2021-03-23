const rawStations = require('./test-fixtures/raw_stations').stations
const { any } = expect

describe('fetching the stations', () => {
  let fetchStations, mockGet

  beforeEach(() => {
    mockGet = jest.fn()
    jest.mock('axios', () => ({
      default: {
        get: mockGet
      }
    }))
    fetchStations = require('./pegelOnline').fetchStations
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