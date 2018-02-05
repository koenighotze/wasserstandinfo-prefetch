const aws = require('aws-sdk')
const s3 = new aws.S3({ apiVersion: '2006-03-01' })

const storeStationData = function (stationdata) {
  const promise = new Promise( (resolve, reject) => {
    const s3params = {
      Bucket: 'dschmitz.wasserstandsinfo',
      Key: 'stations.json',
      Body: JSON.stringify(stationdata),
      Tagging: 'CostCenter=TECCO&Owner=dschmitz'
    }

    console.log('Storing output in ', s3params.Bucket)
    s3.putObject(s3params, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })

  return promise
}

const parseStationData = function (rawdata) {
  return rawdata.map((station) => ( { uuid: station.uuid, name: station.longname, water: station.water.longname } ))
}

module.exports = {
  parseStationData,
  storeStationData
}