/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import {
    RadioGroup, Radio, FormControlLabel, FormControl, TextField, TableRow, TableCell,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import ChipInput from 'material-ui-chip-input';
import IconButton from "@material-ui/core/IconButton";
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import MUIDataTable from "mui-datatables";

import { useSnackbar } from 'notistack';
import { has, isEqual, isNull, isEmpty, pullAt } from 'lodash';
import { KamAppContext } from '../KamAppContext';
import { load, deleteSynonym, addSynonym } from './GraphOps';
import { AddSetting, PolicySettings, FacilitySettings, MenuitemSettings, RoomitemSettings } from './AddSetting';

const useStyles = makeStyles({
    control: {
        padding: 20,
        marginTop: 15,
        background: "#ffe"
    },
});

export default (props) => {
    const [entries, setEntries] = useState([]);
    const [addSettingFlag, setAddSettingFlag] = useState(false);
    const ctx = useContext(KamAppContext);  //FIXME: Remove ctx when auth is implemented
    const [hotel, setHotel] = useState(ctx.hotel);
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadEntries();
    }, [hotel]);

    const loadEntries = async () => {
        let rows = await load(ctx.hotel);
        console.log('data=', rows);
        setEntries(rows);
    }

    const handleAddSetting = () => {
        setAddSettingFlag(true);
    }

    const addSettingToTable = (setting) => {
        if (!isNull(setting) && !isEmpty(setting)) {  // This can happen if the dialog is opened and closed without adding data
            // setEntries(concat(entries, setting));
            enqueueSnackbar('Hotel saved', { variant: 'success' });
        } else {
            enqueueSnackbar('Error saving hotel', { variant: 'error' });
        }
        setAddSettingFlag(false);
    }

    const columns = [
        {
            name: "name",
            label: "Name",
            options: {
                filter: false,
                sort: true,
                searchable: true
            }
        },
        {
            name: "type",
            label: "Type",
            options: {
                filter: true,
                sort: false,
                searchable: true,
            }
        },
        {
            name: "a",
            label: "Available",
            options: {
                filter: true,
                sort: true,
                searchable: false,
                // filterType: 'custom',
                // filterOptions: {
                //     logic: (location, filters) => {
                //         console.log('+++filters=', filters, '+++location=', location, ',+++typeof=',typeof filters);
                //         if (filters.length) return !filters.includes(location);
                //         return false;
                //     },
                //     display: (filterList, onChange, index, column) => {
                //         return (
                //             <FormControl component="fieldset">
                //                 <FormLabel component="legend">Availability</FormLabel>
                //                 <RadioGroup row aria-label="available" name="available" value={boolMap[filterList[index]]} onChange={event => {
                //                     filterList[index] = event.target.value;
                //                     console.log('+++onChange=', event.target.value, ',---', filterList[index], '---', index);
                //                     onChange(filterList[index], index, column);
                //                 }} >
                //                     <FormControlLabel value='yes' control={<Radio />} label="Yes" />
                //                     <FormControlLabel value='no' control={<Radio />} label="No" />
                //                 </RadioGroup>
                //             </FormControl >
                //         );
                //     }
                // },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="available" name="available" value={value} onChange={
                                (event) => {
                                    entries[tableMeta.rowIndex].a = event.target.value;
                                    updateValue(event.target.value);
                                }} >
                                <FormControlLabel value='Yes' control={<Radio />} label="Yes" />
                                <FormControlLabel value='No' control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    );
                }
            }
        },
        {
            name: "synonyms",
            label: "Synonyms",
            options: {
                filter: false,
                sort: false,
                searchable: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    // console.log(tableMeta);
                    return (
                        <ChipInput value={value}
                            allowDuplicates={false}
                            placeholder="Type synonym and press enter"
                            onAdd={async (chip) => {
                                if (chip.length < 3) {
                                    enqueueSnackbar('Minimum length of 3 characters required', { variant: 'error' });
                                    return;
                                }
                                await addSynonym(tableMeta.rowData[0], chip, hotel);
                                value.push(chip);
                                updateValue(value);
                            }}
                            onDelete={async (chip, index) => {
                                await deleteSynonym(tableMeta.rowData[0], chip, hotel);
                                pullAt(value, index);
                                updateValue(value);
                            }}
                        />
                    );
                }
            }
        }
    ];

    const options = {
        filter: true,
        selectableRows: false,
        searchPlaceholder: 'Menu item, room item, facility or policy search',
        filterType: 'checkbox',
        responsive: 'stacked',
        rowsPerPage: 15,
        download: false,
        print: false,
        viewColumns: false,
        expandableRows: true,
        pagination: true,
        caseSensitive: false,
        setTableProps: () => {
            return {
                padding: "default",
                size: "small"
            }
        },
        onRowsExpand: (curExpanded, allExpanded) => console.log('ROW EXPANDED:', curExpanded, allExpanded),
        onTableChange: (action, state) => {
            // console.log('action=', action, 'state=', state);
            // Calculate the unservedOrderCount and set it
            switch (action) {
                case 'changePage':
                    // changePage(state.page);
                    break;
            }
        },
        renderExpandableRow: (rowData, rowMeta) => {
            console.log('++rowData=', rowData, ', +++rowMeta=', entries[rowMeta.dataIndex].type);
            let data = entries[rowMeta.dataIndex];
            let setting;
            if (isEqual(entries[rowMeta.dataIndex].type, 'Facility')) {
                setting = 'facility';
            } if (isEqual(entries[rowMeta.dataIndex].type, 'Policy')) {
                setting = 'policy';
            } if (isEqual(entries[rowMeta.dataIndex].type, 'Menu')) {
                setting = 'menuitem';
            } if (isEqual(entries[rowMeta.dataIndex].type, 'Room')) {
                setting = 'roomitem';
            }
            const colSpan = rowData.length + 1;
            return (
                <TableRow>
                    <TableCell colSpan={colSpan}>
                        {isEqual(setting, 'policy') && <PolicySettings edit data={data} />}
                        {isEqual(setting, 'facility') && <FacilitySettings edit data={data} />}
                        {isEqual(setting, 'menuitem') && <MenuitemSettings edit data={data} />}
                        {isEqual(setting, 'roomitem') && <RoomitemSettings edit data={data} />}
                    </TableCell>
                </TableRow>
            );
        },
        customToolbar: () => (
            <span>
                <IconButton key={addSettingFlag} onClick={handleAddSetting}>
                    <AddCircleRoundedIcon />
                </IconButton>
                {isEqual(addSettingFlag, true) && <AddSetting hotel={hotel} onSettingAdded={addSettingToTable} />}
            </span >
        ),
    };

    return (
        <MUIDataTable
            title={<Typography variant="body2"> </Typography>
            }
            data={entries}
            columns={columns}
            options={options}
        />
    );
}