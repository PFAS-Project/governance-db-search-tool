// https://youtu.be/MiPpQzW_ya0
// https://youtu.be/5TxF9PQaq4U

/*
The first youtube video is a good explanation of setting up the API, follow it to make this work with your own
sample spreadsheet.
To utilize this you will need to create a google spreadsheet and service account. 
Once you acquire your API key, I suggest renaming it "keys.json" and adding keys sheet_id and sheet_name
The google cloud console used for creating the service account can be accessed at console.cloud.google.com
once the account is created make sure to share the spreadsheet with the service account.
Make sure you have npm installed on your machine. 
To run the javascript below, type: "npm run dev" without the quotes into the terminal. 
To access the webpage created by index.html, type: "localhost:9001" without the quotes into your browser.
*/

const {google} = require('googleapis'); // include google api
const keys = require('./keys.json'); // import API keys
const express = require('express');
//const listjs = require('list.js');
const normalizeForSearch = require('normalize-for-search');
const app = express();
const port = 9001; // if you get a port already in use error, changed this and try again
const defaultcells = ['A1','W222']; // default cell range is just header row
const client = new google.auth.JWT( // create client object, which holds the private key and service acc address
    keys.client_email, // service acc
    null,
    keys.private_key, // private key
    ['https://www.googleapis.com/auth/spreadsheets'] // api address
);
var dataSet;

client.authorize(function(err,tokens){ // call the authorize method, which will reach out to the api address and attempt a connection
    if(err){
        console.log(err);
        return;
    } else {
        console.log("connected to google cloud API")
    }
});

async function gsrun(client, sheet, cellRange = defaultcells){ // function which grabs data from sheet, within a particular range
    const gsAPI = google.sheets({version:"v4", auth:client});
    const opt = {
        spreadsheetId: keys.sheet_id, 
        range: sheet + cellRange[0] + ':' + cellRange[1]
    };
    let data = await gsAPI.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    dataSet = dataArray;
    console.log(dataSet)
    return dataArray;
}

function searchData(target){
    found = [];
    for(i in dataSet){
        if(dataSet[i][3] == undefined)
            console.log(dataSet[i][0])
        else if((normalizeForSearch(dataSet[i][3]).includes(normalizeForSearch(target)))){ // second index can be changed depending on which column is being searched
            found.push(dataSet[i])
        }
    }
    return found;
}

app.listen(port, () => {console.log("localhost:" + port)});

app.use(express.static('public'));

gsrun(client, keys.sheet_names[1]);

app.get('/info', async (req,res) => {
    const target = req.query.param1.toString();
    //console.log(target);
    const data = searchData(target);
    //const data = dataSet;
    res.status(200).json({data: data})
})
