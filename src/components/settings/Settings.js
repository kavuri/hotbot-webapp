/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import {
    RadioGroup, Radio, FormControlLabel, FormControl, TableCell, TableRow
} from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';
import IconButton from "@material-ui/core/IconButton";
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import MUIDataTable from "mui-datatables";

import { useSnackbar } from 'notistack';
import { has, isEqual, concat, isNull, pullAt } from 'lodash';
import { AddSetting, PolicySettings, FacilitySettings, MenuitemSettings, RoomitemSettings } from './AddSetting';
import { useKamAppCtx } from '../KamAppContext';
import Selector from '../Selector';

export default (props) => {
    const [entries, setEntries] = useState([]);
    const [addSettingFlag, setAddSettingFlag] = useState(false);
    const [hotels, setHotels] = React.useState([]);
    const [hotel, setHotel] = React.useState({});

    const { enqueueSnackbar } = useSnackbar();
    const { APICall } = useKamAppCtx();

    useEffect(() => {
        loadHotels();
        loadEntries();
    }, [hotel]);

    const loadEntries = async () => {
        let data = [];
        try {
            let res = await APICall('/item', { method: 'GET', keyValues: { hotel_id: hotel.id } });
            data = remapFields(res);
            console.log('length=', data.length);
        } catch (error) {
            console.log('error in fetching hotel settings:', error);
            throw error;
        }

        setEntries(data);
    }

    const loadHotels = async () => {
        // setLoading(true);
        let results = undefined, res;
        try {
            results = await APICall('/hotel', { method: 'GET' });
            res = results.data.map((h) => { return { name: h.name, id: h.hotel_id, _id: h._id } });
            console.log('---hotels=', res);
            setHotels(res);
            // setLoading(false);
        } catch (error) {
            enqueueSnackbar('Error getting hotels', { variant: 'error' });
        }
    }

    function remapFields(arr) {
        let data = [];
        for (var i = 0; i < arr.length; i++) {
            let n = arr[i];
            if (has(n, 'f') || has(n, 'p') || has(n, 'm') || has(n, 'ri')) {
                if (has(n, 'f') && isEqual(n.f, true)) {
                    n.type = 'Facility';
                } else if (has(n, 'p') && isEqual(n.p, true)) {
                    n.type = 'Policy';
                } else if (has(n, 'm') && isEqual(n.m, true)) {
                    n.type = 'Menu';
                } else if (has(n, 'ri') && isEqual(n.ri, true)) {
                    n.type = 'Room';
                }
                // console.log('synonyms=', g.children(nodes[i]));
                n.a = isEqual(n.a, true) ? 'Yes' : 'No';
                if (has(n, 'o')) {
                    n.o = isEqual(n.o, true) ? 'Yes' : 'No';
                }
                data.push(n);
            }
        }
        return data;
    }

    const handleAddSetting = () => {
        setAddSettingFlag(true);
    }

    const updateEntries = (result, index) => {
        if (!isNull(result)) {
            let res = remapFields([result]);
            if (isEqual(index, -1)) {
                // This is a new entry
                let items = concat(entries, res[0]);
                setEntries(items);
                enqueueSnackbar('Added', { variant: 'success' });
            } else {
                entries[index] = res[0];
                enqueueSnackbar('Updated', { variant: 'success' });
            }

        }
        setAddSettingFlag(false);
    };

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
                    // console.log('^^^value=', value, '^^^tableMeta=', tableMeta);
                    return (
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="available" name="available" value={value} onChange={
                                async (event) => {
                                    let newValue = event.target.value;
                                    console.log('^^^event=', event.target.value, '---value=', value);
                                    await APICall('/item/', { method: 'PUT', body: { name: tableMeta.rowData[0], a: isEqual(event.target.value, 'Yes') ? true : false }, keyValues: { hotel_id: hotel.id } });
                                    console.log('+++changed event=', newValue);
                                    entries[tableMeta.rowIndex].a = newValue;
                                    updateValue(newValue);
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
                                await APICall('/item/synonym', { method: 'POST', body: { parent: tableMeta.rowData[0], synonym: chip }, keyValues: { hotel_id: hotel.id } });
                                value.push(chip);
                                updateValue(value);
                            }}
                            onDelete={async (chip, index) => {
                                await APICall('/item/synonym', { method: 'DELETE', body: { parent: tableMeta.rowData[0], synonym: chip }, keyValues: { hotel_id: hotel.id } });
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
        },
        renderExpandableRow: (rowData, rowMeta) => {
            console.log('++rowData=', rowData, ', +++rowMeta=', entries[rowMeta.dataIndex]);
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
                        {isEqual(setting, 'policy') && <PolicySettings onItemSaved={(result) => updateEntries(result, rowMeta.dataIndex)} hotel={hotel} edit data={data} />}
                        {isEqual(setting, 'facility') && <FacilitySettings onItemSaved={(result) => updateEntries(result, rowMeta.dataIndex)} hotel={hotel} edit data={data} />}
                        {isEqual(setting, 'menuitem') && <MenuitemSettings onItemSaved={(result) => updateEntries(result, rowMeta.dataIndex)} hotel={hotel} edit data={data} />}
                        {isEqual(setting, 'roomitem') && <RoomitemSettings onItemSaved={(result) => updateEntries(result, rowMeta.dataIndex)} hotel={hotel} edit data={data} />}
                    </TableCell>
                </TableRow>
            );
        },
        customToolbar: () => (
            <span>
                <IconButton key={addSettingFlag} onClick={handleAddSetting}>
                    <AddCircleRoundedIcon />
                </IconButton>
                {isEqual(addSettingFlag, true) && <AddSetting hotel={hotel} onSettingCreated={(result) => updateEntries(result, -1)} />}
            </span >
        ),
    };

    return (
        <React.Fragment>
            <Selector menuName="Hotels" items={hotels} onSelectEntry={(hotel) => setHotel(hotel)} />
            <MUIDataTable
                title={<Typography variant="body2"> </Typography>
                }
                data={entries}
                columns={columns}
                options={options}
            />
        </React.Fragment>
    );
}