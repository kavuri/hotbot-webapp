/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';

import MUIDataTable from "mui-datatables";
import { unionWith, isEqual, findIndex } from 'lodash';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import StatusButton from './StatusButton';
import { cyan, green, pink, orange } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';

import { useKamAppCtx } from '../KamAppContext';

const renderRow = (value, type) => {
    switch (type) {
        case 'menu':
            return <Chip size='medium' label={value} style={{ background: green[200] }} />
            break;
        case 'roomitem':
            return <Chip size='medium' label={value} style={{ background: cyan[200] }} />
            break;
        case 'facility':
            return <Chip size='medium' label={value} style={{ background: orange[200] }} />
            break;
        case 'problem':
            return <Chip size='medium' label={value} style={{ background: pink[200] }} />
            break;
        default:
            break;
    }
}

export default (props) => {
    const { getOrders, orders } = useKamAppCtx();
    const { enqueueSnackbar } = useSnackbar();

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
                searchable: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return renderRow(value, tableMeta.rowData[5]);
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
                    return renderRow(value, tableMeta.rowData[5]);
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
                    return renderRow(value, tableMeta.rowData[5]);
                }
            }
        },
        {
            name: "item.type",
            label: "Order Type",
            options: {
                filter: true,
                sort: true,
                searchable: false
            },
            customBodyRender: (value, tableMeta, updateValue) => {
                return renderRow(value, value); //FIXME: This column does not get rendered
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
                    //console.log('^^^^value=', value, ',tableMeta=', tableMeta);
                    return (
                        <StatusButton status={value} chip={false} data={tableMeta.rowData} onStatusUpdated={async (newStatus) => {
                            let idx = findIndex(orders.data.allOpen, { _id: tableMeta.rowData[0] });
                            if (!isEqual(idx, -1)) {
                                console.log('updating orders')
                                orders.data.allOpen[idx].curr_status.status = newStatus;
                            }
                            idx = findIndex(orders.data.allOnDate, { _id: tableMeta.rowData[0] });
                            console.log('+++idx=', idx);
                            if (!isEqual(idx, -1)) {
                                orders.data.allOnDate[idx].curr_status.status = newStatus;
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
                data={remapFields(unionWith(orders.data.allOnDate, orders.data.allOpen, isEqual))}
                columns={columns}
                options={options}
            />
        </div>
    );
}