const express = require('express');
const fs = require('fs');
const path = require('path');
const expressApp = express();

let ROOT_PATH: string;
let VIEW_PATH: string;
let STATIC_PATH: string;

type EXPRESS_APP_TYPE = typeof expressApp;
let SERVER: EXPRESS_APP_TYPE;

function serverInit(electronAppPath: string): void {
    console.log(electronAppPath);
    
}

function serverStart(): void {

}

function serverStop(): void {

}

module.exports = {
    init: serverInit,
    start: serverStart,
    stop: serverStop
}




