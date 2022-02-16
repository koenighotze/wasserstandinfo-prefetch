require('dotenv').config()

const UPLOAD_BUCKET_NAME = process.env.UPLOAD_BUCKET_NAME
const STATIONS_OBJECT_KEY_NAME = process.env.STATIONS_OBJECT_KEY_NAME
const LAMBDA_FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME
const region = 'eu-central-1'

const { Lambda, InvokeCommand } = require('@aws-sdk/client-lambda')
const { S3Client, DeleteObjectCommand, HeadBucketCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')
const logger = require('bunyan').createLogger({ name: __filename })

console.log(process.env)
describe('End to end', () => {
    const bucketParams = { Bucket: UPLOAD_BUCKET_NAME }
    const objectParams = { ...bucketParams, Key: STATIONS_OBJECT_KEY_NAME }

    let s3Client, lambdaClient

    const assertBucketExists = () => s3Client.send(new HeadBucketCommand(bucketParams))

    const stationsFileExists = () => s3Client.send(new HeadObjectCommand(objectParams)).catch(() => false)

    const deleteStationsFile = () => s3Client.send(new DeleteObjectCommand(objectParams))

    const invokeFetchStationsLambda = async () => {
        logger.info(`Invoking function ${LAMBDA_FUNCTION_NAME}`)
        await lambdaClient.send(new InvokeCommand({
            FunctionName: LAMBDA_FUNCTION_NAME
        }))
    }

    const cleanUpIfNeeded = async () => {
        await assertBucketExists(s3Client)
        logger.info(`Bucket ${UPLOAD_BUCKET_NAME} exists`)

        if (await stationsFileExists(s3Client)) {
            logger.info('Stations file exists, deleting it')
            await deleteStationsFile(s3Client)
        }
    }

    beforeEach(async () => {
        s3Client = new S3Client({ region })
        lambdaClient = new Lambda({ region })

        await cleanUpIfNeeded()
    })

    afterEach(() => cleanUpIfNeeded())

    it('should load the station data into the bucket', async () => {
        logger.info(`Check that stations file ${STATIONS_OBJECT_KEY_NAME} does not exist in bucket ${UPLOAD_BUCKET_NAME}`)
        await expect(stationsFileExists()).resolves.toBeFalsy()

        await invokeFetchStationsLambda()

        logger.info(`Verify that stations file ${STATIONS_OBJECT_KEY_NAME} exists in bucket ${UPLOAD_BUCKET_NAME}`)
        await expect(stationsFileExists()).resolves.toBeTruthy()
    })
})