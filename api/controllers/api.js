'use strict';

const fetch = require('node-fetch');
const request = require('../cahce/frequencyCache')
const semaphore = require('./semaphore')

const status = res => res.ok ? res : null // check res status

/**
 * fetch from url
 * @param url -
 *   url to fetch
 * @returns json
 *   fetch results
*/
async function makeCall(url) {
    console.log("url to call: ",url)
    const options = {
        method: 'GET',
        headers: {
        }
    };
    try {
        const res = await fetch(url, options).then(status);
        const json = res? await res.json() : res;
        return json;
    } catch (err) {
        console.log("call err :", err.message);
        return null;
    }
}

/**
 * cache resolver 
 * @param url -
 *   url query 
 * @returns 
 *   a cached results if exist or a cached results after update
*/
async function callHandler(url){
    try{
        let cached = await request(url,makeCall);
        if(cached){
            console.log("call to cache result:", cached)
            return cached;
        }
    }catch(err){

    }
}


/**
 * Limits the number of active promises by using a Semaphore 
 * @param func -
 *   promise to queue
 * @param args -
 *   promise's arguments
*/
async function callLimiter(func, args){
    return await semaphore.callFunction(func, args);
};
    

module.exports = {callHandler, callLimiter}