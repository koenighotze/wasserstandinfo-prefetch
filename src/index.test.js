describe('the handler', () => {
  let mockFetcher, handler
  beforeEach(() => {
    mockFetcher = jest.fn()
    jest.mock('./wasserstand-info', () => mockFetcher)

    handler = require('../index').handler
  })

  it('should call the wasserstand info', async () => {
    await handler()

    expect(mockFetcher).toHaveBeenCalled()
  })

  describe('and fetching the wasserstand failed', () => {
    it('should reject', async () => {
      const error = new Error('bumm')
      mockFetcher.mockRejectedValue(error)

      await expect(handler()).rejects.toThrowError(error)
    })
  })
})