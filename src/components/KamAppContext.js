/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect, useContext } from "react";
import { orderListener } from '../utils/API';
import { API_SERVER_URL } from '../Config';
import { isEqual, isEmpty, findIndex, isNull, isUndefined, join } from 'lodash';
import moment from "moment";

import { useAuth0 } from "../react-auth0-spa";
export const KamAppContext = React.createContext();
export const useKamAppCtx = () => useContext(KamAppContext);
export const KamAppProvider = ({ children }) => {
    const [orders, setOrders] = useState({
        openOrderCount: 0,
        reqDate: new Date(),  //Get today's orders by default
        data: []
    });
    const [token, setToken] = useState(null);
    const [incomingOrder, setIncomingOrder] = useState({});
    const { user, getTokenSilently } = useAuth0();

    useEffect(() => {
        console.log('--dumping useAuth:', user, '--useAuth:')
        if (!isNull(user) && !isUndefined(user)) {
            getToken();
        }
        getOrders(orders.reqDate);
    }, [user, token]);

    async function getToken() {
        let tkn = await getTokenSilently();
        setToken(tkn);
    }

    useEffect(() => {
        const listener = orderListener(token);

        listener.onopen = () => console.log('---Connection opened---');
        listener.onerror = () => console.log('---Event source connection error--- ');
        listener.onmessage = e => {
            let order = JSON.parse(e.data);
            console.log('new order received:', order);
            // Check if the order is a new one or an update
            setIncomingOrder(order);
        }

        return () => {
            // Close the listener on component unmount
            listener.close();
        }
    });

    useEffect(() => {
        console.log('+++incmoing=', incomingOrder);
        // We are interested only in 'new' or 'cancelled' orders
        if (!isEmpty(incomingOrder)) {
            let count = orders.openOrderCount;
            if (isEqual(incomingOrder.curr_status.status, 'new')) {
                orders.data.allOnDate.push(incomingOrder);
                count += 1;

            } else if (isEqual(incomingOrder.curr_status.status, 'cancelled')) {
                let openIdx = findIndex(orders.data.allOpen, { _id: incomingOrder._id }),
                    onDateIdx = findIndex(orders.data.allOnDate, { _id: incomingOrder._id });
                if (!isEqual(openIdx, -1)) {
                    orders.data.allOpen[openIdx] = incomingOrder;
                } else if (!isEqual(onDateIdx, -1)) {
                    orders.data.allOnDate[onDateIdx] = incomingOrder;
                }
            }
            setOrders({ ...orders, orders: orders, openOrderCount: count });
        }
    }, [incomingOrder]);

    /**
     * One method to rule them all
     * @param {*} endpoint 
     * @param {*} keyValues, e.g.: [{'hotel_id': '1'}, {'group_id':'2'}]
     * @param {*} method 
     * @param {*} body 
     */
    const APICall = async (endpoint, options) => {
        console.log('+++endpoint=', endpoint, ', options=', options);
        const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
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

    /**
     * Gets all orders on the requested date
     * @param {*} reqDate 
     */
    const getOrders = async (reqDate) => {
        console.log('++Getting all orders for ', reqDate, orders);
        let res = null;
        try {
            console.log('before API call:', reqDate);
            res = await APICall('/order', { method: 'GET', keyValues: { reqDate: moment(reqDate).toISOString() } });
            console.log('after API call:', res);
            setOrders({ data: res, reqDate: reqDate, openOrderCount: res.allOpen.length });
            console.log('^^^', res);
        } catch (error) {
            console.log('error getting orders:', error);
            // FIXME: What to do?
        }
    }

    return (
        <KamAppContext.Provider
            value={{
                orders,
                getOrders,
                APICall
            }}
        >
            {children}
        </KamAppContext.Provider>
    );
};