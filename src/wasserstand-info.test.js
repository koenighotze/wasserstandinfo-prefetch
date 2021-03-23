describe('the wasserstand info', () => {
    let fetchCurrentWasserstand, mockFetchStations, mockStoreStationData, mockParseStationData

    beforeEach(() => {
        mockFetchStations = jest.fn()
        mockStoreStationData = jest.fn()
        mockParseStationData = jest.fn()

        jest.mock('./pegelOnline', () => ({
            fetchStations: mockFetchStations
        }))
        jest.mock('./stationData', () => ({
            storeStationData: mockStoreStationData,
            parseStationData: mockParseStationData
        }))

        fetchCurrentWasserstand = require('./wasserstand-info')
    })

    it('should fetch the stations', async () => {
        await fetchCurrentWasserstand('testbucketname')

        expect(mockFetchStations).toHaveBeenCalled()
    })

    it('should upload the stations to s3', async () => {
        const raw = require('./test-fixtures/raw_stations')
        const parsed = require('./test-fixtures/stations')
        mockFetchStations.mockResolvedValue(raw)
        mockParseStationData.mockReturnValue(parsed)

        await fetchCurrentWasserstand('testbucketname')

        expect(mockParseStationData).toHaveBeenCalled()
        expect(mockStoreStationData).toHaveBeenCalledWith(parsed, 'testbucketname')
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