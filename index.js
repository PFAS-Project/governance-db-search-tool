const {google} = require('googleapis'); // include google api
const keys = require('./keys.json'); // import API keys
const express = require('express');
const fs = require('fs');
// const normalizeForSearch = require('normalize-for-search');
const app = express();
const port = 9001; // if you get a port already in use error, changed this and try again

/**
 * Returns a copy of dataSet after removing any rows 
 * containing empty and undefined values.
 * @param {*} dataSet A 2D array of data
 */
function cleanData(dataSet){ 
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

/**
 * Gets all data from a given Google Sheet.
 * @param {*} client Authorized connection to Google Sheets API
 * @param {*} sheet Which sheet to access, 'STATE' or 'FEDERAL'
 * @returns A 2D array of data
 */
async function getSheetData(client,sheet) { 
    const gsAPI = google.sheets({version:"v4", auth:client});
    const opt = {
        spreadsheetId: keys.sheet_id, 
        range: sheet 
    };
    const data = await gsAPI.spreadsheets.values.get(opt);    
    return data;
}

/**
 * Gets data and metadata from both 'FEDERAL' and 'STATE' sheets.
 * Defines responseObject.
 * @param {*} client Authorized connection to Google Sheets API
 */
async function getData(client) { // get data from both federal and state sheets
    const federalSheetData = await getSheetData(client, 'FEDERAL');
    const federalArray = federalSheetData.data.values;
    const federalInfo = federalArray[1];
    const federalData = federalArray.slice(2);
    
    const stateSheetData = await getSheetData(client, 'STATE');
    const stateArray = stateSheetData.data.values;
    const stateInfo = stateArray[1];
    const stateData = stateArray.slice(2);

    const files = fs.readdirSync('public/static');
    console.log(files)

    responseObject = {
        states: stateInfo[0].split(/\s*;\s*/),
        agencies: federalInfo[0].split(/\s*;\s*/),
        types: stateInfo[3].split(/\s*;\s*/),
        topics: stateInfo[4].split(/\s*;\s*/),
        data: cleanData(federalData.concat(stateData)),
        helpFiles: files
    };
}

async function startup() {
    const client = new google.auth.JWT( // create client object, which holds the private key and service acc address
        keys.client_email, // service acc
        null,
        keys.private_key, // private key
        ['https://www.googleapis.com/auth/spreadsheets'] // api address
    );

    // call the authorize method, which will reach out to the api address and attempt a connection
    client.authorize(function(err,tokens){ 
        if(err){
            console.log(err);
            return;
        } else {
            console.log("connected to google cloud API")
        }
    });

    await getData(client);
    app.use(express.static('public'));
    app.get('/info', async (req,res) => {
        res.status(200).json(responseObject);
    });
    app.listen(port, () => {console.log("localhost:" + port)});
}

startup();
