/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import MUIDataTable from "mui-datatables";
import moment from 'moment';
import { isUndefined, isEmpty } from 'lodash';

import { allHotelGroups } from '../../utils/API';

export default (props) => {
    const [hotelGroups, setHotelGroups] = useState([]);
    const [tableState, setTableState] = useState({
        page: 0,
        count: 1,
        isLoading: false,
        data: [['Loading...']]
    });

    useEffect(() => {
        getHotelGroups();
    }, [hotelGroups]);

    const columns = [
        {
            name: "_id",
            options: {
                display: false,
                filter: false
            }
        },
        {
            name: "name",
            label: "Name",
            options: {
                display: true,
                filter: true,
                sort: true,
                searchable: true
            }
        },
        {
            name: "description",
            label: "Description",
            options: {
                display: true,
                filter: true,
                sort: false,
                searchable: false
            }
        }
    ];

    const getHotelGroups = async () => {
        setTableState({isLoading: true});
        let allGroups = await allHotelGroups();
        console.log('++allGroups=', allGroups);
        setTableState({ data: allGroups.data, count: allGroups.total, isLoading: false });
    }

    const changePage = async (page) => {
        tableState.page = page;
        getHotelGroups(page);
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
        pagination: false,
    };

    return (
        <div>
            <MUIDataTable
                title={<Typography variant="body2">
                    Hotel Groups
                </Typography>
                }
                data={tableState.data}
                columns={columns}
                options={options}
            />
        </div>
    );
}
