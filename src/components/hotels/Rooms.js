/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import MUIDataTable from "mui-datatables";
import { useSnackbar } from 'notistack';
import { concat, isEqual, isNull, findIndex } from 'lodash';

import { APICall } from '../../utils/API';
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
    const { enqueueSnackbar } = useSnackbar();

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
        if (!tableState.isLoading) {
            setTableState({ ...tableState, isLoading: true });
            let rooms = null;
            try {
                rooms = await APICall('/room', { method: 'GET', keyValues: { hotel_id: hotel.hotel_id } });
                setTableState({ ...tableState, data: rooms.data, count: rooms.total, isLoading: false });
            } catch (error) {
                setTableState({ ...tableState, isLoading: false });
                enqueueSnackbar('Unable to get rooms', { variant: 'error' });
            }
        }
    }

    const handleAddRoom = () => {
        setAddRoomFlag(true);
    }

    const addRoomToTable = (room) => {
        if (!isNull(room)) {
            let existsIdx = findIndex(tableState.data, { _id: room._id });
            if (isEqual(existsIdx, -1)) {
                let newList = concat(tableState.data, room);
                setTableState({ ...tableState, data: newList });
            } else {
                tableState.data[existsIdx] = room;
            }

            enqueueSnackbar('Room saved', { variant: 'success' });
        } else {
            enqueueSnackbar('Error saving room', { variant: 'error' });
        }
        setAddRoomFlag(false);
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
            return (<span>
                <IconButton key={addRoomFlag} onClick={handleAddRoom}>
                    <AddCircleRoundedIcon />
                </IconButton>
                {isEqual(addRoomFlag, true) && <AddRoom hotel={hotel} onRoomAdded={addRoomToTable} />}
            </span>)
        },
        customToolbarSelect: selectedRows => {
            return (< span >
                <IconButton key={addRoomFlag} onClick={handleAddRoom}>
                    <EditRoundedIcon />
                </IconButton>
                {isEqual(addRoomFlag, true) && <AddRoom room={tableState.data[selectedRows.data[0].dataIndex]} edit onRoomAdded={addRoomToTable} />}
            </span >)
        },
        onRowsDelete: (rowsDeleted) => {
            return false;
        },
        onRowsSelect: (rowsSelected, allRows) => {
            setTableState({ ...tableState, selected: allRows.map(row => row.dataIndex) });
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
