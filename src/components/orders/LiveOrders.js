/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import MUIDataTable from "mui-datatables";
import { isEqual, concat, isEmpty, findIndex, isUndefined, countBy } from 'lodash';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { APICall, orderListener } from '../../utils/API';
import StatusButton from './StatusButton';
import { cyan } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';

export default (props) => {
    const [hotel, setHotel] = useState(props.hotel);    //FIXME: Temporary. Remove once auth is implemented
    const [unservedOrderCount, setUnservedOrderCount] = useState({ count: 0 });
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
            name: "checkincheckout.guestName",
            label: "Guest Name",
            options: {
                filter: true,
                sort: false,
                searchable: true
            }
        },
        {
            name: "room_no",
            label: "Room",
            options: {
                filter: true,
                sort: true,
                searchable: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <Chip size='medium' label={value} style={{ background: cyan[200] }} />
                }
            }
        },
        {
            name: "item.name",
            label: "Item",
            options: {
                filter: true,
                sort: false,
                searchable: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <Chip size='medium' label={value} style={{ background: cyan[200] }} />
                }
            }
        },
        {
            name: "item.req_count",
            label: "Count",
            options: {
                filter: false,
                sort: false,
                searchable: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <Chip size='medium' label={value} style={{ background: cyan[200] }} />
                }
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
                empty: true,
                filter: true,
                sort: true,
                searchable: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    // console.log('^^^^value=', value, ',tableMeta=', tableMeta);
                    return (
                        <StatusButton status={value} chip={false} data={tableMeta.rowData} onStatusUpdated={async (newStatus) => {
                            console.log('###***###neStatus=', newStatus);
                            // FIXME: If the order is not raised today, remove it from the rows
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
            orders = await APICall('/order', { method: 'GET', keyValues: { hotel_id: hotel.id, live: true, selectedDate: new Date().toISOString() } });
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
     * Function to calculate the unserved order count
     */
    function calcUnservedOrderCount() {
        let count = countBy(data, o => ((o.curr_status.status === 'new') || (o.curr_status.status === 'progress'))).true
        return count;
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
                checkincheckout: o.checkincheckout[0],
                orderTime: moment(o.created_at).format('MMMM Do YYYY, h:mm A'),
                statusChangeTime: moment(o.curr_status.created).format('MMMM Do YYYY, h:mm A'),
                // newStatus: ''
            }
        ));
        return res;
    }

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
        setTableProps: () => {
            return {
                padding: "default",
                size: "small"
            }
        },
        onTableChange: (action, state) => {
            console.log('action=', action, 'state=', state);
            // Calculate the unservedOrderCount and set it
            let count = calcUnservedOrderCount(data);
            setUnservedOrderCount(count);
            console.log('+++UNSERVED ORDER COUNT=', unservedOrderCount);
            // props.onOrdersLoaded(unservedOrderCount);
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
                    {/* All Orders */}
                </Typography>
                }
                data={data}
                columns={columns}
                options={options}
            />
        </div>
    );
}