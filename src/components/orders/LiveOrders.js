/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import MUIDataTable from "mui-datatables";
import { isUndefined, isEmpty } from 'lodash';
import { useSnackbar } from 'notistack';

import { APICall } from '../../utils/API';
import { timeDiff } from '../../utils/helpers';
import StatusButton from './StatusButton';

export default (props) => {
    const [hotel, setHotel] = useState(props.hotel);
    const [tableState, setTableState] = useState({
        page: 0,
        count: 1,
        isLoading: false,
        data: [['Loading...']]
    });
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setHotel(props.hotel);
        getOrders();
    }, []);

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
                // customBodyRender: (value, tabbleMeta, updateValue) => {
                //     // If the order status="done" or "cant_serve", do not show the time since request
                // }
            }
        },
        {
            name: "timeSinceRequest",
            label: "Time Since Request",
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
                    console.log('^^^^value=', value, ',tableMeta=', tableMeta);
                    return (
                        <StatusButton status={value} chip={false} data={tableMeta.rowData} onStatusUpdated={async (newStatus) => {
                            console.log('###***###neStatus=', newStatus)
                            tableMeta.tableData[tableMeta.rowIndex][6] = newStatus;
                            tableMeta.rowData[6] = newStatus;
                            console.log('______tableMeta=', tableMeta);
                            updateValue(newStatus);
                        }} />
                    );
                }
            }
        },
    ];

    const getOrders = async (page) => {
        setTableState({ ...tableState, isLoading: true });
        console.log('$$getOrders=', tableState, ',hotel=', hotel);
        let orders = null;
        try {
            orders = await APICall('/order', { method: 'GET', keyValues: { hotel_id: hotel.id, rowsPerPage: 10, page: page, selectedDate: new Date().toISOString() } });
            let modOrders = isUndefined(orders.data) || isEmpty(orders.data) ? [] : orders.data.map(o => ({ ...o, timeSinceRequest: timeDiff(o.created_at, o.curr_status.created), newStatus: '' }));
            console.log('modOrders=', modOrders);
            setTableState({ ...tableState, data: modOrders, count: orders.total, isLoading: false });
        } catch (error) {
            setTableState({ ...tableState, isLoading: false });
            enqueueSnackbar('Error getting orders. Try again', { variant: 'error' });
        }
    }

    const changePage = async (page) => {
        console.log('Got request to change to page:', page);
        // setTableState({ page: page });
        console.log('%%% changing page=', tableState);
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
        // serverSide: true,   // Only required in history. Make 'false' for LiveOrders as we will get all orders into browser memory
        pagination: true,
        count: tableState.count,
        page: tableState.page,
        onTableChange: (action, state) => {
            // console.log('action=', action, 'state=', state);
            switch (action) {
                case 'changePage':
                    changePage(state.page);
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
                data={tableState.data}
                columns={columns}
                options={options}
            />
        </div>
    );
}