import React from 'react';

import {
    Form,
    Select,
    InputNumber,
    DatePicker,
    Switch,
    Slider,
    Button
} from 'antd'

import axios from 'axios' ;

let  cryptWorker;


let selfKey ;

if(typeof window !== 'undefined'){
    cryptWorker = new Worker('/static/crypto-worker.js');
}

/** Post a message to the web worker and return a promise that will resolve with the response.  */
function getWebWorkerResponse (messageType, messagePayload) {
    return new Promise((resolve, reject) => {
        // Generate a random message id to identify the corresponding event callback
        const messageId = Math.floor(Math.random() * 100000)

        // Post the message to the webworker
        cryptWorker.postMessage([messageType, messageId].concat(messagePayload))

        // Create a handler for the webworker message event
        const handler = function (e) {
            // Only handle messages with the matching message id
            if (e.data[0] === messageId) {
                // Remove the event listener once the listener has been called.
                e.currentTarget.removeEventListener(e.type, handler)

                // Resolve the promise with the message payload.
                resolve(e.data[1])
            }
        };

        // Assign the handler to the webworker 'message' event.
        cryptWorker.addEventListener('message', handler)
    })
}

async function getUser() {
    const key = await getSelfKey();
    debugger;
    try {
        const response = await axios.get('/user?ID=12345');
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

 function getSelfKey() {
    if(selfKey) return  Promise.resolve( selfKey);
    return new Promise((resolve,reject)=>{
        getWebWorkerResponse('generate-keys').then(key => resolve(key));

    });
}






export default ()=>{


    return (
        <Button type="primary" onClick={
            ()=> getUser()
        }> Send Msg </Button>
    )


}