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
var dataSet;



client.authorize(function(err,tokens){ // call the authorize method, which will reach out to the api address and attempt a connection
    if(err){
        console.log(err);
        return;
    } else {
        console.log("connected to google cloud API")
    }
});

async function gsrun(client, sheet){ // function which grabs data from sheet, within a particular range
    const gsAPI = google.sheets({version:"v4", auth:client});
    const opt = {
        spreadsheetId: keys.sheet_id, 
        range: "FEDERAL" // get all rows/columms from the sheet
        // TODO: Get data from both FEDERAL and STATE sheets
    };
    let data = await gsAPI.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    dataHeader = dataArray[0];
    dataInfo = dataArray[1];
    dataSet = dataArray.slice(2);
    return dataArray;
}

app.listen(port, () => {console.log("localhost:" + port)});

app.use(express.static('public'));

gsrun(client, keys.sheet_names[0]); // second parameter index can be changed to specify the sheet accessed, 0 = federal, 1 = state

app.get('/info', async (req,res) => {
    res.status(200).json({data: dataSet}) // this object can be specified to make data presentation easier
})
