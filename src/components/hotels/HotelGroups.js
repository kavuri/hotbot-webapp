/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import MUIDataTable from "mui-datatables";
import moment from 'moment';
import { isUndefined, concat } from 'lodash';

import { allHotelGroups } from '../../utils/API';
import ToolbarAddButton from './ToolbarAddButton';
import AddGroup from './AddGroup';

export default (props) => {
    const [hotelGroups, setHotelGroups] = useState([]);
    const [addGroupFlag, setAddGroupFlag] = useState(false);
    const [tableState, setTableState] = useState({
        page: 0,
        count: 1,
        isLoading: false,
        selected: [],
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
                filter: false,
                sort: false,
                searchable: false
            }
        }
    ];

    const getHotelGroups = async () => {
        setTableState({ isLoading: true });
        let allGroups = await allHotelGroups();
        console.log('++allGroups=', allGroups);
        setTableState({ data: allGroups.data, count: allGroups.total, isLoading: false });
        console.log('+++TABLE STATE=', tableState);
    }

    const changePage = async (page) => {
        tableState.page = page;
        getHotelGroups(page);
    };

    const handleAddGroup = () => {
        console.log('add group called');
        setAddGroupFlag(true);
    }

    const addGroupToTable = (group) => {
        console.log('adding to table:', group);
        let newList = concat(tableState.data, group);
        setTableState({ ...tableState, data: newList });
        console.log('^^^New table state=', tableState);
    }

    const options = {
        filter: true,
        selectableRows: 'single',
        selectableRowsOnClick: true,
        filterType: 'dropdown',
        responsive: "scroll",
        rowsPerPage: 10,
        download: false,
        print: false,
        viewColumns: false,
        pagination: false,
        rowsSelected: tableState.selected,
        customToolbar: () => {
            return <div><ToolbarAddButton onAddClick={handleAddGroup} />{(addGroupFlag == true) && <AddGroup onGroupAdded={addGroupToTable} />}</div>;
        },
        onRowsDelete: (rowsDeleted) => {
            return false;
        },
        onRowsSelect: (rowsSelected, allRows) => {
            // console.log('rowSelected=', rowsSelected, allRows);
            console.log('SELECTED=', tableState.selected);
            // setTableState({ ...tableState, selected: allRows });
            // setTableState({ ...tableState, selected: allRows.map(row => row.dataIndex) });
            console.log('+++tabeseta=', tableState);
        },
        onRowClick: (rowData, rowState) => {
            console.log('---row clicked=', rowData, rowState);
        },
        isRowSelectable: (dataIndex, selectedRows) => {
            return true;
        }
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
