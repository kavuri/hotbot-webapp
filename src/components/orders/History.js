/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import IconButton from "@material-ui/core/IconButton";
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { cyan, lightBlue, teal } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';
import MUIDataTable from "mui-datatables";
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { isUndefined, isEmpty } from 'lodash';

import { APICall } from '../../utils/API';
import StatusButton from './StatusButton';

export default (props) => {
    const [hotel, setHotel] = useState(props.hotel);
    const [tableState, setTableState] = useState({
        page: 0,
        count: 1,
        isLoading: false,
        data: []
    });
    const { enqueueSnackbar } = useSnackbar();
    const [selectedDate, setSelectedDate] = useState(moment(moment().subtract(1, 'day')));
    useEffect(() => {
        setHotel(props.hotel);
        getOrders();
    }, []);


    const handleDateChange = date => {
        // console.log('-----Date change called=', date);
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
        // setSelectedDate(moment(selectedDate).subtract(1, 'day'));
        let d = moment(selectedDate).subtract(1, 'day');
        setSelectedDate(d);
        // console.log('+++LEFT+++', selectedDate, d);
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
                filter: true,
                sort: true,
                searchable: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    // console.log('^^^^value=', value, ',tableMeta=', tableMeta);
                    return (
                        <StatusButton status={value} chip data={tableState.data} />
                    );
                }
            }
        },
    ];

    const getOrders = async (dt) => {
        if (!tableState.isLoading) {
            setTableState({ ...tableState, isLoading: true });
            let d = isUndefined(dt) ? selectedDate : dt;

            let orders = null;
            try {
                orders = await APICall('/order', { method: 'GET', keyValues: { hotel_id: hotel.id, live: false, selectedDate: d.toISOString() } });
                // let orders = await allOrders(hotel, { page: tableState.page, status: undefined, selectedDate: d.toISOString() });
                let modOrders = isUndefined(orders.data) || isEmpty(orders.data) ? [] : remapFields(orders.data);
                console.log('modOrders=', modOrders);
                setTableState({ ...tableState, data: modOrders, count: orders.total, isLoading: false });
            } catch (error) {
                setTableState({ ...tableState, isLoading: false });
                enqueueSnackbar('Error getting orders. Try again', { variant: 'error' });
            }
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
                checkincheckout: o.checkincheckout[0],
                orderTime: moment(o.created_at).format('MMMM Do YYYY, h:mm A'),
                statusChangeTime: moment(o.curr_status.created).format('MMMM Do YYYY, h:mm A'),
                newStatus: ''
            }
        ));
        return res;
    }

    const changePage = async (page) => {
        console.log('Got request to change to page:', page);
        setTableState({ ...tableState, page: page });
        console.log('%%% changing page=', tableState);
        getOrders();
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
                data={tableState.data}
                columns={columns}
                options={options}
            />
        </div >
    );
}