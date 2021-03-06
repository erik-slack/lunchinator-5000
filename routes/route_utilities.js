/***************************************************************************
These https utilities are meant to be used to reduce the amounts of code in
the specific routes files.  Simply pass in the path and it will assume the 
base url defined at the top.  Also pass in what should be done when the
response is done being loaded.
***************************************************************************/

var https = require('https');
var constants = require('./route_constants');

var BASE_URL = constants.BASE_URL;
var BASE_PATH = constants.BASE_PATH;

module.exports = {
    httpsGet: httpsGet,
    httpsPost: httpsPost,
    defaultOnErrFunction: defaultOnErrFunction,
    defaultOnNon200Code: defaultOnNon200Code
};

function defaultOnErrFunction(res) {
    return function (err) {
        console.log('!!! ERROR !!!');
        console.log(err);
        console.error(err);
        res.status(500).send(err);
    };
};

function defaultOnNon200Code(res) {
    return function (message) {
        console.log('!!! NON-200 !!!');
        console.log(message);
        res.status(500).send(message);
    }
};

function httpsGet(thisPath, onEndFunction, onErrFunction, onNon200Code) {
    //console.log('\nOutgoing URL');
    //console.log('https://' + BASE_URL + BASE_PATH + thisPath);
    var d = new Date();
    //console.log('Timestamp: ' + d);

    var options = {
        rejectUnauthorized: false,
        hostname: BASE_URL,
        //port: 443,
        path: BASE_PATH + thisPath,
        method: 'GET'
    };

    var responseBody = '';

    var requestToService = https.request(options, function (responseFromService) {
        //console.log("statusCode: ", responseFromService.statusCode);
        //console.log("headers: ", responseFromService.headers);

        responseFromService.on('data', function (d) {
            if (d !== null)
                responseBody += d;
        });
        responseFromService.on('end', function () {
            //console.log('Response Data:');
            if (responseBody === ''){
                //console.log('No data');
            } else {
                //console.log(responseBody);
            }
            onEndFunction(responseBody, responseFromService);
        });
    });
    requestToService.end();

    requestToService.on('error', function (e) {
        onErrFunction(e);
    });
};

function httpsPost(thisPath, onEndFunction, onErrFunction, onNon200Code, thisPostData) {

    //console.log('\nOutgoing URL');
    //console.log('https://' + BASE_URL + thisPath);

    //console.log(thisPostData);

    var options = {
        rejectUnauthorized: false,
        hostname: BASE_URL,
        port: 443,
        path: thisPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': thisPostData.length
        }
    };

    var responseBody = '';

    var requestToService = https.request(options, function (responseFromService) {
        //console.log("statusCode: ", responseFromService.statusCode);
        if (responseFromService.statusCode != 200) {
            onNon200Code(responseFromService.statusMessage);
        }
        //console.log("headers: ", responseFromService.headers);

        responseFromService.on('data', function (d) {
            if (d !== null)
                responseBody += d;
        });

        responseFromService.on('end', function () {
            //console.log('Response Data:');
            if (responseBody === ''){
                //console.log('NO DATA');
            } else {
                //console.log(responseBody);
            }
            onEndFunction(responseBody, responseFromService);
        });
    });
    requestToService.write(thisPostData);
    requestToService.on('error', function (err) {
        onErrFunction(err);
    });
    requestToService.end();
};