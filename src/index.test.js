describe('the handler', () => {
  let mockFetcher, handler
  beforeEach(() => {
    mockFetcher = jest.fn()
    jest.mock('./wasserstand-info', () => mockFetcher)

    handler = require('../index').handler
    process.env.UPLOAD_BUCKET_NAME = 'testbucket'
    process.env.STATIONS_OBJECT_KEY_NAME = 'teststations.json'
  })

  afterEach(() => {
    delete process.env.UPLOAD_BUCKET_NAME
    delete process.env.STATIONS_OBJECT_KEY_NAME
  })

  it('should call the wasserstand info', async () => {
    await handler()

    expect(mockFetcher).toHaveBeenCalledWith('testbucket', 'teststations.json')
  })
//  "integrity": "sha1-zy04vcNKE0vK8QkcQfZhni9nLQA=",
// quick check if detect secret works
  describe('and fetching the wasserstand failed', () => {
    it('should reject', async () => {
      const error = new Error('bumm')
      mockFetcher.mockRejectedValue(error)

      await expect(handler()).rejects.toThrowError(error)
    })
  })
})