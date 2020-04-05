/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/Typography';
import { purple, orange, green, yellow, red } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';

import MUIDataTable from "mui-datatables";

import { isNull, isUndefined, concat, find } from 'lodash';

import Selector from '../Selector';
import { allOrders, searchOrders, changeOrderStatus } from '../../utils/API';
import { timeDiff } from '../../utils/helpers';
import StatusButton from './StatusButton';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const statuses = [
    { name: 'NEW', id: 'new', borderColor: orange[700], bgcolor: orange[100] },
    { name: 'PROGRESS', id: 'progress', borderColor: yellow['A700'], bgcolor: yellow['A100'] },
    { name: 'FINISHED', id: 'done', borderColor: green[700], bgcolor: green['A100'] },
    { name: 'NOT AVAILABLE', id: 'cant_serve', borderColor: purple[700], bgcolor: purple['A100'] },
    { name: 'CANCELLED', id: 'cancelled', borderColor: red[700], bgcolor: purple['A100'] }
];

export default (props) => {
    const [hotel, setHotel] = useState(props.hotel);
    const [tableState, setTableState] = useState({
        page: 0,
        count: 1,
        isLoading: false,
        data: [['Loading...']]
    });

    useEffect(() => {
        setHotel(props.hotel);
        getOrders();
    }, []);

    const columns = [
        {
            name: "_id",
            options: {
                display: false
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
                        <StatusButton status={value} data={tableMeta.rowData} onStatusUpdated={async (newStatus) => {
                            console.log('###***###neStatus=', newStatus)
                            tableMeta.tableData[tableMeta.rowIndex][6] = newStatus;
                            tableMeta.rowData[6] = newStatus;
                            console.log('______tableMeta=',tableMeta);
                            updateValue(newStatus);
                        }} />
                    );
                }
            }
        },
        // {
        //     label: "Change Status",
        //     name: "newStatus",
        //     options: {
        //         filter: false,
        //         sort: false,
        //         searchable: false,
        //         customBodyRender: (value, tableMeta, updateValue) => {
        //             console.log('+++++value=', value + 'ChangeStatus:tableMeta=', tableMeta, ',updateValue=', updateValue);
        //             return (
        //                 <Selector items={statuses} onSelectEntry={async (value) => {
        //                     console.log('$$$$changed=', value);
        //                     let updatedOrder = await changeOrderStatus(tableMeta.rowData[0], value.id);
        //                     console.log('&&&&&updatedOrder=', updatedOrder);
        //                     tableMeta.tableData[tableMeta.rowIndex][6] = updatedOrder.curr_status.status;
        //                     tableMeta.rowData[6] = updatedOrder.curr_status.status;
        //                     console.log('#####Updated state rows=', tableMeta);
        //                     updateValue(value);
        //                 }} defaultEntry={find(statuses, { id: tableMeta.rowData[6] })} />
        //             );
        //         }
        //     }
        // }
    ];

    const getOrders = async (page) => {
        setTableState({ isLoading: true, page: page });
        console.log('$$getOrders=', tableState, ',hotel=', hotel);
        let orders = await allOrders(hotel, tableState.page);
        let now = new Date();
        // let modOrders = orders.data.map(o => ({ ...o, timeSinceRequest: 'music'}));
        let modOrders = orders.data.map(o => ({ ...o, timeSinceRequest: timeDiff(o.created_at, now), newStatus: '' }));
        console.log('modOrders=', modOrders);
        setTableState({ data: modOrders, count: orders.total, isLoading: false });
    }

    const changePage = async (page) => {
        console.log('Got request to change to page:', page);
        // setTableState({ page: page });
        tableState.page = page;
        console.log('%%% changing page=', tableState);
        getOrders(page);
    };

    const orderSearch = async (state) => {
        console.log('### searching for ' + state.searchText);
        let orders = await searchOrders(hotel, state.page, state.searchText);
        setTableState({ data: orders.data, count: orders.total, isLoading: false });
    }

    const orderFilter = async (hotel, filter) => {

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
        // serverSide: true,   // Only required in history. Make 'false' for LiveOrders as we will get all orders into browser memory
        pagination: true,
        count: tableState.count,
        page: tableState.page,
        onTableChange: (action, state) => {
            console.log('action=', action, 'state=', state);
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
          {/* {tableState.isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />} */}
                </Typography>
                }
                data={tableState.data}
                columns={columns}
                options={options}
            />
        </div>
    );
}