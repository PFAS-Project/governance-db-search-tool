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
    console.log('Removed %d rows with missing data', cleaned.length);
    console.log('Found %d valid rows', found.length);
    return found;
};

async function getSheetData(client,sheet) { // get all rows/columms from the sheet
    const gsAPI = google.sheets({version:"v4", auth:client});
    const opt = {
        spreadsheetId: keys.sheet_id, 
        range: sheet 
    };
    const data = await gsAPI.spreadsheets.values.get(opt);    
    return data;
}

async function getData(client) { // get data from both federal and state sheets
    const federalSheetData = await getSheetData(client, 'FEDERAL');
    const federalArray = federalSheetData.data.values;
    const federalInfo = federalArray[1];
    const federalData = federalArray.slice(2);
    
    const stateSheetData = await getSheetData(client, 'STATE');
    const stateArray = stateSheetData.data.values;
    const stateInfo = stateArray[1];
    const stateData = stateArray.slice(2);

    responseObject = {
        states: stateInfo[0].split(/;\s*/),
        agencies: federalInfo[0].split(/;\s*/),
        types: stateInfo[3].split(/;\s*/),
        topics: stateInfo[4].split(/;\s*/),
        data: cleanData(federalData.concat(stateData))
    };
}

getData(client);
app.use(express.static('public'));
app.listen(port, () => {console.log("localhost:" + port)});

app.get('/info', async (req,res) => {
    res.status(200).json(responseObject) // this object can be specified to make data presentation easier
});
