/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/Typography';

import MUIDataTable from "mui-datatables";

import { isNull, isUndefined, concat, remove } from 'lodash';

import { allOrders, searchOrders } from '../../utils/API';
import CustomSearchRender from './CustomSearchRender';

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

export default (props) => {
    const classes = useStyles();
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
            name: "room_no",
            label: "Room",
            options: {
                filter: true,
                sort: false,
                searchable: false
            }
        },
        {
            name: "guestName",
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
            name: "createdAt",
            label: "Date/Time",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "serviceTime",
            label: "Service Time",
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
                searchable: true
            }
        }
    ];

    const getOrders = async (page) => {
        setTableState({ isLoading: true, page: page });
        console.log('$$getOrders=', tableState);
        let orders = await allOrders(hotel, tableState.page);
        setTableState({ data: orders.data, count: orders.total, isLoading: false });
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
        serverSide: true,   // Only required in history. Make 'false' for LiveOrders as we will get all orders into browser memory
        pagination: true,
        count: tableState.count,
        page: tableState.page,
        customSearchRender: (searchText, handleSearch, hideSearch, options) => {
            return (
                <CustomSearchRender
                    searchText={searchText}
                    onSearch={handleSearch}
                    onHide={hideSearch}
                    options={options}
                />
            );
        },
        onTableChange: (action, state) => {
            console.log('action=', action, 'state=', state);
            switch (action) {
                case 'changePage':
                    changePage(state.page);
                    break;
                // case 'search':
                //     let searchText = state.searchText;
                //     console.log('^^^^^ searchText=', searchText);
                //     if (!isNull(searchText) && (searchText.length >= 3)) {
                //         // Only then search in server
                //         orderSearch(state);
                //     }
                //     break;
                case 'filterChange':
                    // Combine state.columns and state.filterList to get the key/value pairs of searchable items
                    // var filter = 
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