/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import MUIDataTable from "mui-datatables";
import { isEqual, concat, isEmpty, findIndex, isUndefined } from 'lodash';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { APICall, orderListener } from '../../utils/API';
import StatusButton from './StatusButton';

export default (props) => {
    const [hotel, setHotel] = useState(props.hotel);    //FIXME: Temporary. Remove once auth is implemented
    // const [newOrderCount, setNewOrderCount] = useState({ count: 0 });
    const [data, setData] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setHotel(props.hotel);
        getOrders();
    }, []);

    useEffect(() => {
        const listener = orderListener();

        listener.onopen = () => console.log('---Connection opened---');
        listener.onerror = () => console.log('---Event source connection error--- ');
        listener.onmessage = e => {
            let order = JSON.parse(e.data);
            addOrder(order);
        }

        return () => {
            // Close the listener on component unmount
            listener.close();
        }
    }, [data]);

    const columns = [
        {
            name: "_id",
            options: {
                display: false,
                filter: false
            }
        },
        {
            name: "room_no",
            label: "Room",
            options: {
                filter: true,
                sort: true,
                searchable: false
            }
        },
        {
            name: "checkincheckout.guestName",
            label: "Guest Name",
            options: {
                filter: true,
                sort: false,
                searchable: true
            }
        },
        {
            name: "item.name",
            label: "Item",
            options: {
                filter: true,
                sort: false,
                searchable: true
            }
        },
        {
            name: "item.req_count",
            label: "Count",
            options: {
                filter: false,
                sort: false,
                searchable: false,
            }
        },
        {
            name: "orderTime",
            label: "Order Time",
            options: {
                filter: false,
                sort: true
            }
        },
        {
            name: "statusChangeTime",
            label: "Status Change Time",
            options: {
                filter: false,
                sort: true
            }
        },
        {
            name: "curr_status.status",
            label: "Status",
            options: {
                filter: true,
                sort: true,
                searchable: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    // console.log('^^^^value=', value, ',tableMeta=', tableMeta);
                    return (
                        <StatusButton status={value} chip={false} data={tableMeta.rowData} onStatusUpdated={async (newStatus) => {
                            console.log('###***###neStatus=', newStatus)
                            tableMeta.tableData[tableMeta.rowIndex][7] = newStatus;
                            tableMeta.rowData[7] = newStatus;
                            console.log('______tableMeta=', tableMeta);
                            updateValue(newStatus);
                        }} />
                    );
                }
            }
        },
    ];

    const getOrders = async (page) => {
        let orders = null;
        try {
            orders = await APICall('/order', { method: 'GET', keyValues: { hotel_id: hotel.id, rowsPerPage: 10, page: page, selectedDate: new Date().toISOString() } });
            let modOrders = isUndefined(orders.data) || isEmpty(orders.data) ? [] : remapFields(orders.data);
            setData(modOrders);
        } catch (error) {
            enqueueSnackbar('Error getting orders. Try again', { variant: 'error' });
        }
    }

    const addOrder = (order) => {
        // Remap the fields
        let remapped = remapFields([order]);
        console.log('remapped fields=', remapped);

        // Check if the order is already in the table
        // Incase the user has refreshed the data and also the order is received at the sametime
        let existsIdx = findIndex(data, { _id: order._id });
        console.log('Does record exist=', existsIdx);
        if (isEqual(existsIdx, -1)) {
            let newList = concat(data, remapped);
            console.log('#### New list=', newList);
            setData(newList);
        } else {
            data[existsIdx] = remapped[0];
        }
    }

    /**
     * Remaps orders received from database to a format that the display table supports
     * @param {*} arr 
     * @returns an array of remappied orders
     */
    function remapFields(arr) {
        var res = arr.map(o => (
            {
                ...o,
                orderTime: moment(o.created_at).format('MMMM Do YYYY, h:mm A'),
                statusChangeTime: moment(o.curr_status.created).format('MMMM Do YYYY, h:mm A'),
                newStatus: ''
            }
        ));
        return res;
    }

    const changePage = async (page) => {
        // setTableState({ page: page });
        getOrders(page);
    };

    const options = {
        filter: true,
        selectableRows: false,
        filterType: 'checkbox',
        responsive: "scroll",
        rowsPerPage: 10,
        download: false,
        print: false,
        viewColumns: false,
        pagination: true,
        // count: tableState.count,
        // page: tableState.page,
        onTableChange: (action, state) => {
            console.log('action=', action, 'state=', state);
            switch (action) {
                case 'changePage':
                    // changePage(state.page);
                    break;
            }
        }
    };

    return (
        <div>
            <MUIDataTable
                title={<Typography variant="body2">
                    All Orders
                </Typography>
                }
                data={data}
                columns={columns}
                options={options}
            />
        </div>
    );
}