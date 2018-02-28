const Util = require('util')
const Joi = require('joi')
const AWS = require('aws-sdk')

const schema = {
  'lambdaName': Joi.string().required(),
  'invokationCount': Joi.number().required(),
  'dryRun': Joi.boolean().default(true)
}
const validationOptions = {
  abortEarly: false
}

const invokeLambda = ({lambdaName, invokationCount, dryRun}) => {
  const lambda = new AWS.Lambda()

  const invokeOptions = {
    FunctionName: lambdaName,
    Payload: JSON.stringify({}),
    InvocationType: dryRun ? 'DryRun' : 'Event'
  }
  console.log('Do things')
  for (let i = 0; i < invokationCount; i++) {
    console.log(`Invoking ${lambdaName}`)
    lambda.invoke(invokeOptions)
      .promise()
      .then(result => {
        console.log(result)      
      })
      .catch(error => {
        console.warn(`Invokation failed. Reason: ${error.message}`)      
      })
  }
}

exports.handler = (event, context, callback) => {
  console.log(`Received ${Util.inspect(event)}`)

  const { error, value } = Joi.validate(event,  schema, validationOptions)
  if (error) {
    return callback(new Error('Cannot parse event'))
  }

  invokeLambda(value)

  callback(null, value)
}