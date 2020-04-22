/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import { API_SERVER_URL } from '../Config';
import { isEqual, isUndefined, has, join } from 'lodash';

const headers = { 'Content-Type': 'application/json' };
// { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token }

export const changeDeviceStatus = async (state, device) => {
    let URL;
    if (isEqual(state, 'active')) {
        // Deactivate the device
        URL = API_SERVER_URL + '/device/' + device.device_id + '/deactivate?hotel_id=' + device.hotel_id;
    } else if (isEqual(state, 'inactive')) {
        // activate the device
        URL = API_SERVER_URL + '/device/' + device.device_id + '/activate?hotel_id=' + device.hotel_id;
    }

    let result = await fetch(URL, { method: 'POST', headers: headers })
        .then(res => res.json())
        .then((result) => {
            console.log('devices=', result);
            return result;
        })
        .catch((error) => { return error });
    return result;
}

export const deregisterDevice = async (device) => {
    console.log('###deegister device=', device);
    let result = await fetch(API_SERVER_URL + '/device/' + device.device_id + '/deregister?hotel_id=' + device.hotel_id + '&room_no=' + device.room_no, { method: 'POST', headers: headers })
        .then(res => res.json())
        .then((result) => {
            console.log('devices=', result);
            return result;
        })
        .catch((error) => { return error; });
    return result;
}

/**
 * One method to rule them all
 * @param {*} endpoint 
 * @param {*} keyValues, e.g.: [{'hotel_id': '1'}, {'group_id':'2'}]
 * @param {*} method 
 * @param {*} body 
 */
export const APICall = async (endpoint, options) => {
    console.log('+++endpoint=', endpoint, ', options=', options);
    let query = !isUndefined(options.keyValues) ? join(Object.keys(options.keyValues).map(key => { let s = key + '=' + options.keyValues[key]; return s; }), '&') : undefined;
    console.log('APICall query=:', query);
    let URL = API_SERVER_URL + endpoint + (!isUndefined(query) ? '?' + query : '');
    let results = await fetch(URL, { method: options.method, body: JSON.stringify(options.body), headers: headers })
        .then(response => {
            if (!response.ok) throw response;
            return response.json();
        })
        .then(results => { return results; })
        .catch((error) => { throw error; })

    return results;
}

export const orderListener = (token) => {
    const eventSource = new EventSource(API_SERVER_URL + '/order/listen?token=' + token);
    // const eventSource = new EventSource(API_SERVER_URL + '/order/testlisten');
    return eventSource;
}