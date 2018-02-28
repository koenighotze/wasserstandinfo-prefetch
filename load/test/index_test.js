const Lab = require('lab')
const { beforeEach, describe, it } = exports.lab = Lab.script()
const sinon = require('sinon')
const expect = require('chai').expect

const proxyquire =  require('proxyquire')
 
const lambda = { 
  invokeCount: 0,
  lastOpts: {},
  shouldFail: false,
  reset() {
    this.invokeCount = 0
    this.lastOpts = {}
    this.shouldFail = false
  },
  invoke(opts) {
    console.log('Set lastopts to',opts)
    this.lastOpts = opts
    this.invokeCount += 1
    const self = this
    return {  
      promise() {
        return self.shouldFail ? Promise.reject(new Error()) : Promise.resolve('ok')
      }
    }
  }
}
const Index = proxyquire('../index', { 
  'aws-sdk': { 
    'Lambda': function () {      
      return lambda
    }
  } 
})

const handler = Index.handler

describe('the lambda', () => {

  beforeEach( () => {
    lambda.reset()
  })

  it('should just log errors on failing to call the target lambda', () => {
    lambda.shouldFail = true

    handler({ invokationCount: 1, lambdaName: 'foo' }, {}, () => {})

    // todo how to test for errors
  })

  it('should call the target lambda in event mode if configured', () => {
    handler({ invokationCount: 1, lambdaName: 'foo', dryRun: false }, {}, () => {})

    expect(lambda.lastOpts.InvocationType).to.be.eql('Event')
  })

  it('should call the target lambda in dry mode per default', () => {
    handler({ invokationCount: 1, lambdaName: 'foo'}, {}, () => {})

    expect(lambda.lastOpts.InvocationType).to.be.eql('DryRun')
  })

  it('should call the target lambda in dry mode if configured', () => {
    handler({ invokationCount: 1, lambdaName: 'foo', dryRun: true }, {}, () => {})

    expect(lambda.lastOpts.InvocationType).to.be.eql('DryRun')
  })

  it('should invoke the defined lambda', () => {
    const invokationCount = 12

    handler({ invokationCount: invokationCount, lambdaName: 'foo' }, {}, () => {})

    expect(lambda.invokeCount).to.be.eql(invokationCount)
  })

  it('should return an error if the lambdafunction name is missing', () => {
    const callback = (err, data) => {
      expect(err).to.be.not.null
      expect(data).to.be.undefined
    }

    handler({ invokationCount: 12 }, {}, callback)
  })

  it('should return an error if the invokation count is missing', () => {
    const callback = (err, data) => {
      expect(err).to.be.not.null
      expect(data).to.be.undefined
    }

    handler({ lambdaName: 'foo' }, {}, callback)
  })

  it('should call the callback if the event is empty', () => {
    const callback = sinon.spy()
    
    handler({}, {}, callback)

    expect(callback.called).to.be.true
  })
})