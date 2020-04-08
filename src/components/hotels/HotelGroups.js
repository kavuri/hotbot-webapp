/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import MUIDataTable from "mui-datatables";
import { concat, isEqual, isNull } from 'lodash';

import { allHotelGroups, APICall } from '../../utils/API';
import AddGroup from './AddGroup';
import Alert from '../Alert';

export default (props) => {
    const [addGroupFlag, setAddGroupFlag] = useState(false);
    const [tableState, setTableState] = useState({
        page: 0,
        count: 1,
        isLoading: false,
        selected: [],
        data: [['Loading...']]
    });

    const [info, setInfo] = useState({
        open: false,
        message: '',
        severity: ''
    });

    useEffect(() => {
        getHotelGroups();
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
        // let allGroups = await allHotelGroups();
        let allGroups = await APICall('/hotelGroup', {method: 'GET'});
        console.log('++allGroups=', allGroups);
        setTableState({ data: allGroups.data, count: allGroups.total, isLoading: false });
        console.log('+++TABLE STATE=', tableState);
    }

    const handleAddGroup = () => {
        console.log('add group called');
        setAddGroupFlag(true);
        console.log('add group flag=', addGroupFlag);
    }

    const addGroupToTable = (group) => {
        console.log('adding to table:', group);
        if (!isNull(group)) {
            let newList = concat(tableState.data, group);
            setTableState({ ...tableState, data: newList });
            console.log('^^^New table state=', tableState);
            setInfo({ message: 'Hotel Group saved', open: true, severity: 'success' });
        } else {
            setInfo({ message: 'Error saving hotel group', open: true, severity: 'error' });
        }
        setAddGroupFlag(false);
    }

    const options = {
        filter: true,
        selectableRows: 'single',
        selectableRowsOnClick: true,
        filterType: 'dropdown',
        responsive: "scrollMaxHeight",
        rowsPerPage: 10,
        download: false,
        print: false,
        viewColumns: false,
        rowsSelected: tableState.selected,
        customToolbar: () => {
            return <span><IconButton key={addGroupFlag} onClick={handleAddGroup}> <AddCircleRoundedIcon /> </IconButton>{isEqual(addGroupFlag, true) && <AddGroup onGroupAdded={addGroupToTable} />}</span>
        },
        onRowsDelete: (rowsDeleted) => {
            return false;
        },
        onRowsSelect: (rowsSelected, allRows) => {
            console.log('SELECTED=', tableState, tableState.data[rowsSelected[0].dataIndex]);
            setTableState({ ...tableState, selected: allRows.map(row => row.dataIndex) });

            props.onHotelGroupSelected(tableState.data[rowsSelected[0].dataIndex]);
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
            <Alert key={info.open} open={info.open} message={info.message} severity={info.severity} />
            <MUIDataTable
                title={<Typography variant="body2">
                </Typography>
                }
                data={tableState.data}
                columns={columns}
                options={options}
            />
        </div>
    );
}
