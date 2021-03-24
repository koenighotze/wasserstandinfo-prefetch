const aws = require('aws-sdk')
const s3 = new aws.S3({ apiVersion: '2006-03-01' })
const logger = require('bunyan').createLogger({ name: __filename })

const storeStationData = async (stationdata, bucketName) => {
  if (!bucketName) {
    throw new Error('Bucket name UPLOAD_BUCKET_NAME is not set!')
  }

  const s3params = {
    Bucket: bucketName,
    Key: 'stations.json',
    Body: JSON.stringify(stationdata),
    Tagging: 'CostCenter=TECCO&Owner=dschmitz'
  }

  logger.info('Storing output in', s3params.Bucket)
  return await s3.putObject(s3params).promise()
}

const parseStationData = (rawdata) => rawdata.map((station) => ({ uuid: station.uuid, name: station.longname, water: station.water.longname } ))

module.exports = {
  parseStationData,
  storeStationData
}