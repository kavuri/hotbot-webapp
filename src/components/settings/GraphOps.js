/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { has, isEqual, isUndefined, isEmpty } from 'lodash';
import { APICall } from '../../utils/API';

const graphlib = require('@dagrejs/graphlib');
const Graph = graphlib.Graph;
var g;

/**
 * Loads the graph from the server
 * FIXME: Do not fetch the full graph? As clients would have access to it?
 * @param {*} hotel 
 */
export const load = async (hotel) => {  //FIXME: Remove hotel from args when auth is implemented
    let res;
    try {
        res = await APICall('/graph', { method: 'GET', keyValues: { hotel_id: hotel.id } });
        g = graphlib.json.read(res);
        console.log(g.nodeCount(), '++check++', g.node('Gym_location'));

        // Create a map of the data
        let nodes = g.nodes();
        let data = [];
        for (var i = 0; i < nodes.length; i++) {
            let n = g.node(nodes[i]);
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
                n.name = nodes[i];
                // console.log('synonyms=', g.children(nodes[i]));
                n.synonyms = isUndefined(g.children(nodes[i])) || isEmpty(g.children(nodes[i])) ? [] : g.children(nodes[i]);
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

export const node = (name) => {
    return g.node(name);
}

/**
 * Saves the graph to the server
 */
export const createFaciliy = async (facility) => {
    if (isEmpty(facility)) {
        throw new Error('invalid facility object:', facility);
    }

    g.setNode(facility.name, facility); //FIXME: Remove the 'name' attr from the facility object
    if (facility.synonyms) {
        facility.synonyms.map((s) => {
            g.setParet(s, facility.name);
        })
    }

    console.log('creaed node=', g.node(facility.name), '++,hotel_id=', g.graph(), '++graph=', graphlib.json.write(g));
    let res;
    try {
        res = await APICall('/graph', { method: 'PUT', body: {graph: JSON.stringify(graphlib.json.write(g))}, keyValues: { hotel_id: g.graph() } });
        console.log('graph written:', res)
    } catch (error) {
        console.log('error saving graph:', error);
        throw error;
    }
    return facility;    //FIXME:
}

export const entries = () => {

}

export const addNode = (node) => {

}

export const deleteNode = (node) => {

}

export const updateNode = (node) => {

}