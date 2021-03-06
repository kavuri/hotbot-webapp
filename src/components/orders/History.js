/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';

import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import IconButton from "@material-ui/core/IconButton";
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { cyan } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';
import MUIDataTable from "mui-datatables";
import moment from 'moment';
import { isUndefined } from 'lodash';
import { useSnackbar } from 'notistack';

import { useKamAppCtx } from '../KamAppContext';
import StatusButton from './StatusButton';

import { renderRow } from './Orders';

export default (props) => {
    const { getOrders, orders } = useKamAppCtx();
    const { enqueueSnackbar } = useSnackbar();
    const [selectedDate, setSelectedDate] = useState(moment(moment().subtract(1, 'day')));
    useEffect(() => {
        console.log('---+++inUseEffect:', orders);
        getOrders(selectedDate);
    }, []);

    const handleDateChange = date => {
        console.log('-----Date change called=');
        let dtClone = selectedDate.clone();
        dtClone = date;
        setSelectedDate(dtClone);
        // console.log('+++DATE SELECTED+++', selectedDate);
        getOrders(date);
    };

    const moveRight = () => {
        let d = moment(selectedDate).add(1, 'day');
        setSelectedDate(d);
        // console.log('+++RIGHT+++', selectedDate);
        getOrders(d);
    };

    const moveLeft = () => {
        setSelectedDate(moment(selectedDate).subtract(1, 'day'));
        let d = moment(selectedDate).subtract(1, 'day');
        setSelectedDate(d);
        console.log('+++LEFT+++', selectedDate, d);
        getOrders(d);
    }

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
                return renderRow(value, tableMeta.rowData[5]);
                //return renderRow(value, value); //FIXME: This column does not get rendered
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
                        <StatusButton status={value} chip data={orders} />
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
        console.log('------#', arr)
        var res = !isUndefined(arr) ? arr.map(o => (
            {
                ...o,
                checkincheckout: o.checkincheckout[0],
                orderTime: moment(o.created_at).format('MMMM Do YYYY, h:mm A'),
                statusChangeTime: moment(o.curr_status.created).format('MMMM Do YYYY, h:mm A'),
                newStatus: ''
            }
        )) : [];
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
        // serverSide: true,   // Only required in history. Make 'false' for LiveOrders as we will get all orders into browser memory
        pagination: true,
        setTableProps: () => {
            return {
                padding: "default",
                size: "small"
            }
        },
        onTableChange: (action, state) => {
            // console.log('action=', action, 'state=', state);
            switch (action) {
                case 'changePage':
                    // changePage(state.page);
                    break;
            }
        }
    };

    return (
        <div>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <IconButton aria-label="left" color="primary" onClick={moveLeft}>
                    <ChevronLeftRoundedIcon />
                </IconButton>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    inputVariant="outlined"
                    autoOk="true"
                    format="DD/MM/YYYY"
                    margin="none"
                    id="date-picker-inline"
                    label="Select date"
                    value={selectedDate}
                    disableFuture={true}
                    onChange={date => handleDateChange(date)}
                    KeyboardButtonProps={{
                        "aria-label": "change date"
                    }}
                />
                <IconButton aria-label="right" color="primary" onClick={moveRight}>
                    <ChevronRightRoundedIcon />
                </IconButton>
            </MuiPickersUtilsProvider>
            <MUIDataTable
                title={<Typography variant="body2">
                    All Orders
                </Typography>}
                data={remapFields(orders.data.allOnDate)}
                columns={columns}
                options={options}
            />
        </div >
    );
}