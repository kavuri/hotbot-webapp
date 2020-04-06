/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import IconButton from "@material-ui/core/IconButton";
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MUIDataTable from "mui-datatables";
import moment from 'moment';
import { isUndefined, isEmpty } from 'lodash';

import { allOrders } from '../../utils/API';
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

    const [selectedDate, setSelectedDate] = useState(moment());
    // const [selectedDate, setSelectedDate] = useState(moment().subtract(1, 'day'));

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
                    // console.log('^^^^value=', value, ',tableMeta=', tableMeta);
                    return (
                        <StatusButton status={value} chip={true} data={tableState.data} />
                    );
                }
            }
        },
    ];

    const getOrders = async (dt) => {
        if (!tableState.isLoading) {
            setTableState({ isLoading: true });
            // console.log('^^^^^GETTING ORDERS WITH SELECTED DATE=', selectedDate);
            let d = isUndefined(dt) ? selectedDate : dt;
            let orders = await allOrders(hotel, { page: tableState.page, status: undefined, selectedDate: d.toISOString() });
            // let modOrders = orders.data.map(o => ({ ...o, timeSinceRequest: 'music'}));
            let modOrders = isUndefined(orders.data) || isEmpty(orders.data) ? [] : orders.data.map(o => ({ ...o, timeSinceRequest: timeDiff(o.created_at, o.curr_status.created), newStatus: '' }));
            console.log('modOrders=', modOrders);
            setTableState({ data: modOrders, count: orders.total, isLoading: false });
        }
    }

    const changePage = async (page) => {
        console.log('Got request to change to page:', page);
        // setTableState({ page: page });
        tableState.page = page;
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
            <MuiPickersUtilsProvider utils={MomentUtils}>
                {/* <Grid container justify="space-around"> */}
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
                {/* </Grid> */}
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