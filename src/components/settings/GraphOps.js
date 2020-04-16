/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { has, isEqual, isUndefined, isEmpty } from 'lodash';
import { APICall } from '../../utils/API';

/**
 * Loads the graph from the server
 * FIXME: Do not fetch the full graph? As clients would have access to it?
 * @param {*} hotel 
 */
export const load = async (hotel) => {  //FIXME: Remove hotel from args when auth is implemented
    let res;
    try {
        res = await APICall('/item', { method: 'GET', keyValues: { hotel_id: hotel.id } });

        // Create a map of the data
        let data = [];
        for (var i = 0; i < res.length; i++) {
            let n = res[i];
            if (has(n, 'f') || has(n, 'p') || has(n, 'm') || has(n, 'ri')) {
                if (has(n, 'f') && isEqual(n.f, true)) {
                    n.type = 'Facility';
                } else if (has(n, 'p') && isEqual(n.p, true)) {
                    n.type = 'Policy';
                } else if (has(n, 'm') && isEqual(n.m, true)) {
                    n.type = 'Menu';
                } else if (has(n, 'ri') && isEqual(n.ri, true)) {
                    n.type = 'Room';
                }
                // console.log('synonyms=', g.children(nodes[i]));
                n.a = isEqual(n.a, true) ? 'Yes' : 'No';
                if (has(n, 'o')) {
                    n.o = isEqual(n.o, true) ? 'Yes' : 'No';
                }
                data.push(n);
            }
        }
        console.log('length=', data.length);
        return data;
    } catch (error) {
        console.log('error in fetching hotel settings:', error);
        throw error;
    }
}

/**
 * Creates a item for the hotel 
 */
export const createItem = async (item, hotel) => {
    if (isEmpty(item)) {
        throw new Error('invalid item object:', item);
    }

    console.log('item=', item);
    let res;
    try {
        res = await APICall('/item', { method: 'POST', body: item, keyValues: { hotel_id: hotel.id } });
        console.log('item created:', res)
    } catch (error) {
        console.log('error saving graph:', error);
        throw error;
    }
    return item;
}

/**
 * Update a item in the hotel 
 */
export const updateItem = async (item, hotel) => {
    if (isEmpty(item)) {
        throw new Error('invalid item object:', item);
    }

    console.log('item=', item);
    let res;
    try {
        res = await APICall('/item', { method: 'PUT', body: item, keyValues: { hotel_id: hotel.id } });
        console.log('item created:', res)
    } catch (error) {
        console.log('error saving graph:', error);
        throw error;
    }
    return item;
}

export const deleteSynonym = async (parent, synonym, hotel) => {
    if (isUndefined(parent) || isUndefined(synonym)) {
        throw new Error('invalid item object:', parent, synonym);
    }

    console.log('parent=', parent, ',synonym=', synonym);
    let res;
    try {
        res = await APICall('/item/synonym', { method: 'DELETE', body: { parent: parent, synonym: synonym }, keyValues: { hotel_id: hotel.id } });
        console.log('item created:', res)
    } catch (error) {
        console.log('error saving graph:', error);
        throw error;
    }
    return {parent: parent, synonym: synonym};
}

export const addSynonym = async (parent, synonym, hotel) => {
    console.log('addSynonym:', parent, synonym, hotel);
    if (isUndefined(parent) || isUndefined(synonym)) {
        throw new Error('invalid item object:', parent, synonym);
    }

    console.log('parent=', parent, ',synonym=', synonym);
    let res;
    try {
        res = await APICall('/item/synonym', { method: 'POST', body: { parent: parent, synonym: synonym }, keyValues: { hotel_id: hotel.id } });
        console.log('item deleted:', res)
    } catch (error) {
        console.log('error saving graph:', error);
        throw error;
    }
    return {parent: parent, synonym: synonym};
}