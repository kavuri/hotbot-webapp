/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import MUIDataTable from "mui-datatables";
import IconButton from "@material-ui/core/IconButton";
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import { isEqual, isUndefined, concat, join, isEmpty, isNull } from 'lodash';

import { allHotels } from '../../utils/API';
import AddHotel from './AddHotel';

export default (props) => {
    const [group, setGroup] = useState(isNull(props.group) ? '' : props.group);
    const [addHotelFlag, setAddHotelFlag] = useState(false);
    const [tableState, setTableState] = useState({
        page: 0,
        count: 1,
        isLoading: false,
        selected: [],
        data: [['Loading...']]
    });

    useEffect(() => {
        setGroup(isNull(props.group) ? '' : props.group);
        console.log('+++GOT NEW GROUP=', props.group);
        getHotels();
    }, [group]);

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
        },
        {
            name: "fullAddress",
            label: "Address",
            options: {
                display: true,
                filter: false,
                sort: false,
                searchable: true
            }
        },
        {
            name: "fullContact",
            label: "Contact",
            options: {
                display: true,
                filter: true,
                sort: false,
                searchable: true
            }
        },
        {
            name: "fullCoordinates",
            label: "Coordinates",
            options: {
                display: true,
                filter: true,
                sort: false,
                searchable: true
            }
        },
        {
            name: "roomCount",
            label: "Rooms",
            options: {
                display: true,
                filter: false,
                sort: true,
                searchable: false
            }
        },
        {
            name: "front_desk_count",
            label: "Front Desks",
            options: {
                display: true,
                filter: false,
                sort: true,
                searchable: false
            }
        },
        {
            name: "reception_number",
            label: "Reception Number",
            options: {
                display: true,
                filter: true,
                sort: false,
                searchable: true
            }
        }
    ];

    const getHotels = async () => {
        setTableState({ isLoading: true });
        console.log('----GETTNG hotels for group_id:', group.group_id);
        let hotels = await allHotels(group.group_id);
        let modHotels = isUndefined(hotels.data) || isEmpty(hotels.data) ? [] : remapFields(hotels.data);
        console.log('++allHotels=', modHotels);
        setTableState({ ...tableState, data: modHotels, count: hotels.total, isLoading: false });
    }

    function remapFields(arr) {
        console.log('Mapping for:', arr);
        var res = arr.map(h => (
            {
                ...h,
                fullAddress: join(Object.values(h.address, ', ')),
                fullContact: join(Object.values(h.contact['phone']), ', ') + ', ' + join(Object.values(h.contact['email']), ', '),
                fullCoordinates: 'lat: ' + h.coordinates.lat + ', lng:' + h.coordinates.lng,
                roomCount: h.rooms.length
            }
        ));
        return res;
    }

    const handleAddHotel = () => {
        setAddHotelFlag(true);
    }

    const addHotelToTable = (hotel) => {
        if (!isUndefined(hotel)) {  // This can happen if the dialog is opened and closed without adding data
            var remapped = remapFields([hotel]);
            console.log('adding to table:', hotel);
            let newList = concat(tableState.data, remapped);
            setTableState({ ...tableState, data: newList });
            console.log('^^^New table state=', tableState);
        }
        setAddHotelFlag(false);
    }

    const options = {
        filter: true,
        selectableRows: 'single',
        selectableRowsOnClick: true,
        filterType: 'dropdown',
        responsive: "scroll",
        rowsPerPage: 5,
        download: false,
        print: false,
        viewColumns: false,
        pagination: false,
        rowsSelected: tableState.selected,
        customToolbar: () => {
            return <span><IconButton key={addHotelFlag} onClick={handleAddHotel}> <AddCircleRoundedIcon /> </IconButton>{isEqual(addHotelFlag, true) && <AddHotel group={group} onHotelAdded={addHotelToTable} />}</span>
        },
        onRowsDelete: (rowsDeleted) => {
            return false;
        },
        onRowsSelect: (rowsSelected, allRows) => {
            console.log('SELECTED=', tableState, tableState.data[rowsSelected[0].dataIndex]);
            setTableState({ ...tableState, selected: allRows.map(row => row.dataIndex) });

            // TODO: Show hotels belonging to the group
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
                    Hotels
                </Typography>
                }
                data={tableState.data}
                columns={columns}
                options={options}
            />
        </div>
    );
}
