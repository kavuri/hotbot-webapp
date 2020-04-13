/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect } from "react";
import { APICall, orderListener } from '../utils/API';
import { isEqual, isEmpty, findIndex, countBy } from 'lodash';
import moment from "moment";

export const KamAppContext = React.createContext();

export const KamAppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState({
        openOrderCount: 0,
        reqDate: new Date(),  //Get today's orders by default
        data: []
    });
    const [hotel, setHotel] = useState({});
    const [incomingOrder, setIncomingOrder] = useState({});

    useEffect(() => {
        console.log('USE Effect invoked. Getting orders:', hotel);
        setHotel(hotel);
        getOrders(orders.reqDate, hotel);
    }, [hotel]);

    useEffect(() => {
        const listener = orderListener();

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
     * Gets all orders on the requested date
     * @param {*} reqDate 
     * @param {*} hotel 
     */
    const getOrders = async (reqDate) => {  //FIXME: Remove hotel once auth is implemented
        console.log('++Getting all orders for ', reqDate, orders, hotel);
        // setHotel(hotel);
        let res = null;
        try {
            console.log('before API call:', reqDate);
            res = await APICall('/order', { method: 'GET', keyValues: { hotel_id: hotel.id, reqDate: moment(reqDate).toISOString() } });
            console.log('after API call:', res);
            // orders = await APICall('/order', { method: 'GET', keyValues: { hotel_id: hotel.id, live: true, selectedDate: new Date().toISOString() } });
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
                setHotel,
                hotel
            }}
        >
            {children}
        </KamAppContext.Provider>
    );
};