const serialPort = require('serialport');
const { delimiter, parse } = require('path');
const { response } = require('express');
const { findSourceMap } = require('module');
const path = require('path');

const SerialPort = serialPort.SerialPort;

const port = new SerialPort({path:'COM7',  baudRate: 9600 }, (err) => {
    if (err) {
        console.error('Error opening serial port:', err);
    } else {
        console.log('Serial port opened successfully.');
    }
});

const apiurl = "https://api.n2yo.com/rest/v1/satellite/positions/37265/31.396/75.536/0/2/&apiKey=CQDK5M-CCVH37-2FT2XU-591G";
async function fetchdata(){
    try{
         const response = await fetch(apiurl)
         const data = response.json();
         return data;
     }
     catch(error){
        console.error("error in fetching data:",error);
        return null; 
     }
}

function senddataToarduino(data){
    let stringdata = data
    stringdata = JSON.stringify(stringdata)
    console.log(stringdata);
    port.write(stringdata, (err) => {
        if(err){
            return console.error("error during writing on serial port",err)
        }
        console.log('data sent to arduino:',stringdata)
    })
}

async function main(){
    const data = await fetchdata()
    let azimuth_value = data.positions[0].elevation
    azimuth_value = parseInt(azimuth_value)
    console.log("from main function-"+azimuth_value);
    if(azimuth_value){
        senddataToarduino(azimuth_value);
}
}
setTimeout(main,2000);

