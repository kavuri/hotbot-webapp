/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';

import MUIDataTable from "mui-datatables";
import { unionWith, isEqual, findIndex } from 'lodash';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import StatusButton from './StatusButton';
import { cyan } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';

import { KamAppContext } from '../KamAppContext';

export default (props) => {
    const ctx = useContext(KamAppContext);
    const [orders, setOrders] = useState(ctx.orders);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        ctx.getOrders(moment());
    }, [orders]);

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
                            {/* console.log('###***###neStatus=', newStatus, tableMeta); */}
                            let idx = findIndex(ctx.orders.data.allOpen, { _id: tableMeta.rowData[0] });
                            {/* console.log('---idx=', idx, '---', ctx.orders.data.allOpen, ',---', tableMeta.rowData[0]); */}
                            if (!isEqual(idx, -1)) {
                                console.log('updating ctx.orders')
                                ctx.orders.data.allOpen[idx].curr_status.status = newStatus;
                            }
                            idx = findIndex(ctx.orders.data.allOnDate, { _id: tableMeta.rowData[0] });
                            console.log('+++idx=', idx);
                            if (!isEqual(idx, -1)) {
                                ctx.orders.data.allOnDate[idx].curr_status.status = newStatus;
                            }
                            updateValue(newStatus);
                        }
                        } />
                    );
                }
            }
        },
    ];

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
                data={remapFields(unionWith(ctx.orders.data.allOnDate, ctx.orders.data.allOpen, isEqual))}
                columns={columns}
                options={options}
            />
        </div>
    );
}