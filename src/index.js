const Fetch = require('./fetchStationData')
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const storeStationData = function (stationdata) {
    const promise = new Promise( (resolve, reject) => {
        const s3params = {
            Bucket: 'dschmitz.wasserstandsinfo',
            Key: 'stations.json',
            Body: JSON.stringify(stationdata),
            Tagging: "CostCenter=TECCO&Owner=dschmitz"
        };

        console.log('Storing output in ', s3params.Bucket);

        s3.putObject(s3params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                console.log('Upload success');
                resolve(data);
            }
        });
    });

    return promise;
};

const parseStationData = function (rawdata) {
  return rawdata.map(station => ( { uuid: station.uuid, name: station.longname, water: station.water.longname } ))
}

exports.handler = (event, context, callback) => {
  console.log('Updating local station data')
  Fetch.handler( (err, stations) => {
    if (err) {
      console.log('Cannot fetch stations!', err)
      callback(err)
    }
    else {
      console.log('Storing stations to S3')
      storeStationData(parseStationData(stations)).then(result => callback(null)).catch(err => callback(err))
    }
  })
};