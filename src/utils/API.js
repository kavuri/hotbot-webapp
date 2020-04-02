/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import { API_SERVER_URL } from '../Config';
import { isEqual } from 'lodash';

const headers = { 'Content-Type': 'application/json' };
// { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token }

export const allUnassignedDevices = async () => {
    let allItems = await fetch(API_SERVER_URL + '/device/unassigned', { method: 'GET', headers: headers })
        .then(res => res.json())
        .then((results) => {
            return results;
        })
        .catch((error) => { return error });
    return allItems;
}

export const allHotels = async () => {
    let hotels = await fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: headers })
        .then(res => res.json())
        .then((results) => {
            return results;
        })
        .catch((error) => { return error });
    return hotels;
}

export const getHotelRooms = async (hotel) => {
    let hotelRooms = await fetch(API_SERVER_URL + '/hotel/' + hotel.id, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then((results) => {
            return results.rooms;
        })
        .catch((error) => { return error });
    return hotelRooms;
}

export const assignDevice = async (device, hotel, room) => {
    let result = await fetch(API_SERVER_URL + '/device/' + device.id + '/register?hotel_id=' + hotel.id + '&room_no=' + room.id, { method: 'POST', headers: headers })
        .then(res => res.json())
        .then((results) => {
            return results;
        })
        .catch((error) => { return error; });
    return result;
}

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

export const getHotelDevices = async (hotel) => {
    let results = await fetch(API_SERVER_URL + '/device?hotel_id=' + hotel.id, { method: 'GET', headers: headers })
        .then(res => res.json())
        .then((results) => {
            return results;
        })
        .catch((error) => { return error; })
    return results;
}

export const checkinGuest = async (room, guestData) => {
    console.log('guest details=', guestData)
    let results = await fetch(
        API_SERVER_URL + '/room/' + room.room_no +
        '/checkin?hotel_id=' + room.hotel_id,
        { method: 'POST', body: JSON.stringify(guestData), headers: headers })
        .then(res => res.json())
        .then((results) => {
            return results;
        })
        .catch((error) => { return error; })
    return results;
}

export const checkoutGuest = async (room) => {
    let results = await fetch(
        API_SERVER_URL + '/room/' + room.room_no +
        '/checkout?hotel_id=' + room.hotel_id,
        { method: 'POST', headers: headers })
        .then(res => res.json())
        .then((results) => {
            return results;
        })
        .catch((error) => { return error; })
    return results;
}