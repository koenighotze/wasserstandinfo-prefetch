const Wreck = require('wreck');

const fetchPage = function(callback) {
    const url = 'https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/'
    console.log("Fetching stations from " + url);
    Wreck.get(url, {
              timeout: 2000
         })
         .then( (res) => {
             callback(null, JSON.parse(res.payload));
         })
         .catch(error => {
             console.log("Fetching failed with", error);
             callback(error);
         });
};

const handler = function (callback) {
    fetchPage((err, body) => {
        if (err) {
            callback(err);
        }
        else {
            callback(null, body)
        }
    });
};

module.exports = {
    'handler': handler
};

if (process.env.NODE_ENV === 'development') {
    handler((err, events) => {
        if (err) {
            console.warn(err);
        }
        else {
            console.log(events);
        }
    } );
}
