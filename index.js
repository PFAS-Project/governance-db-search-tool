const {google} = require('googleapis'); // include google api
const keys = require('./keys.json'); // import API keys
const express = require('express');
const normalizeForSearch = require('normalize-for-search');
const app = express();
const port = 9001; // if you get a port already in use error, changed this and try again
const client = new google.auth.JWT( // create client object, which holds the private key and service acc address
    keys.client_email, // service acc
    null,
    keys.private_key, // private key
    ['https://www.googleapis.com/auth/spreadsheets'] // api address
);
// var dataSet;

client.authorize(function(err,tokens){ // call the authorize method, which will reach out to the api address and attempt a connection
    if(err){
        console.log(err);
        return;
    } else {
        console.log("connected to google cloud API")
    }
});

function cleanData(dataSet){ // this function is used to clean out rows containing empty and undefined rows. 
    found = [];
    cleaned = [];
    for(i in dataSet){
        if(dataSet[i][3] == undefined) 
            cleaned.push(dataSet[i])
        else{ 
            found.push(dataSet[i])
        }
    }
    console.log('%d rows have missing data:', cleaned.length, cleaned)
    return found;
};

async function gsrun(client){ // function which grabs data from sheet, within a particular range
    const gsAPI = google.sheets({version:"v4", auth:client});
    const opt = {
        spreadsheetId: keys.sheet_id, 
        range: "STATE" // get all rows/columms from the sheet
        // TODO: Get data from both FEDERAL and STATE sheets
    };
    let data = await gsAPI.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    dataHeader = dataArray[0];
    dataInfo = dataArray[1];
    let dataSet = dataArray.slice(2);
    // cleanData();
    return dataSet;
}

app.listen(port, () => {console.log("localhost:" + port)});

app.use(express.static('public'));

// gsrun(client);

app.get('/info', async (req,res) => {
    const dataSet = await gsrun(client);
    res.status(200).json({data: cleanData(dataSet)}) // this object can be specified to make data presentation easier
});
