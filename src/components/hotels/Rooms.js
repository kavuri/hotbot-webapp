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

import { allRooms } from '../../utils/API';
import AddRoom from './AddRoom';

export default (props) => {
    const [addRoomFlag, setAddRoomFlag] = useState(false);
    const [hotel, setHotel] = useState(isNull(props.hotel) ? '' : props.hotel);
    const [tableState, setTableState] = useState({
        page: 0,
        count: 1,
        isLoading: false,
        selected: [],
        data: [['Loading...']]
    });

    useEffect(() => {
        getRooms();
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
                display: true,
                filter: true,
                sort: true,
                searchable: true
            }
        },
        {
            name: "type",
            label: "Room Type",
            options: {
                display: true,
                filter: true,
                sort: true,
                searchable: true
            }
        }
    ];

    const getRooms = async () => {
        setTableState({ isLoading: true });
        let rooms = await allRooms(hotel.hotel_id);
        console.log('++allRooms=', rooms);
        setTableState({ data: rooms.data, count: rooms.total, isLoading: false });
        console.log('+++TABLE STATE=', tableState);
    }

    const handleAddRoom = () => {
        console.log('add Room called');
        setAddRoomFlag(true);
        console.log('add Roomroup flag=', addRoomFlag);
    }

    const addRoomToTable = (room) => {
        console.log('adding to table:', room);
        let newList = concat(tableState.data, room);
        setTableState({ ...tableState, data: newList });
        console.log('^^^New table state=', tableState);
        setAddRoomFlag(false);
    }

    const options = {
        filter: true,
        selectableRows: 'none',
        selectableRowsOnClick: true,
        filterType: 'dropdown',
        responsive: "scrollMaxHeight",
        rowsPerPage: 10,
        download: false,
        print: false,
        viewColumns: false,
        rowsSelected: tableState.selected,
        customToolbar: () => {
            return <span><IconButton key={addRoomFlag} onClick={handleAddRoom}> <AddCircleRoundedIcon /> </IconButton>{isEqual(addRoomFlag, true) && <AddRoom hotel={hotel} onRoomAdded={ addRoomToTable } />}</span>
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
