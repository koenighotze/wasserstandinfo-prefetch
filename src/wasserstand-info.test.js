const { v4: uuid } = require('uuid')
describe('the wasserstand info', () => {
    const mockUploadBucketName = uuid()
    const mockStationsObjectKeyName = uuid()
    let fetchCurrentWasserstand, mockFetchStations, mockStoreStationData, mockParseStationData

    beforeEach(() => {
        mockFetchStations = jest.fn()
        mockStoreStationData = jest.fn()
        mockParseStationData = jest.fn()
        jest.mock('./config', () => ({
            uploadBucketName: mockUploadBucketName,
            stationsObjectKeyName: mockStationsObjectKeyName
        }))
        jest.mock('./pegel-online', () => ({
            fetchStations: mockFetchStations
        }))
        jest.mock('./station-data', () => ({
            storeStationData: mockStoreStationData,
            parseStationData: mockParseStationData
        }))

        fetchCurrentWasserstand = require('./wasserstand-info')
    })

    it('should fetch the stations', async () => {
        await fetchCurrentWasserstand()

        expect(mockFetchStations).toHaveBeenCalled()
    })

    it('should upload the stations to s3', async () => {
        const raw = require('./test-fixtures/raw_stations')
        const parsed = require('./test-fixtures/stations')
        mockFetchStations.mockResolvedValue(raw)
        mockParseStationData.mockReturnValue(parsed)

        await fetchCurrentWasserstand()

        expect(mockParseStationData).toHaveBeenCalled()
        expect(mockStoreStationData).toHaveBeenCalledWith(parsed, mockUploadBucketName, mockStationsObjectKeyName)
    })

    describe('and fetching the stations fails', () => {
        it('should reject', async () => {
            const error = new Error('bumm')
            mockFetchStations.mockRejectedValue(error)

            await expect(fetchCurrentWasserstand('testbucketname')).rejects.toThrowError(error)
        })
    })

    describe('and uploading fails', () => {
        it('should reject', async () => {
            const error = new Error('bumm')
            mockStoreStationData.mockRejectedValue(error)

            await expect(fetchCurrentWasserstand('testbucketname')).rejects.toThrowError(error)
        })
    })
})