/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import {
    RadioGroup, Radio, FormControlLabel, FormControl, FormLabel, Grid, Paper, Checkbox,
    TextField, TableRow, TableCell, MuiThemeProvider, createMuiTheme
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import ChipInput from 'material-ui-chip-input';
import MUIDataTable from "mui-datatables";

import { has, isEqual } from 'lodash';
import { KamAppContext } from '../KamAppContext';
import { load, node } from './GraphOps';

const useStyles = makeStyles({
    control: {
        padding: 20,
        marginTop: 15,
        background: "#ffe"
    },
});

export default (props) => {
    const [entries, setEntries] = useState([]);
    const ctx = useContext(KamAppContext);  //FIXME: Remove ctx when auth is implemented
    const [hotel, setHotel] = useState(ctx.hotel);
    const classes = useStyles();

    useEffect(() => {
        loadEntries();
    }, [hotel]);

    const loadEntries = async () => {
        let rows = await load(ctx.hotel);
        console.log('data=', rows);
        setEntries(rows);
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
                filterType: 'custom',
                filterOptions: {
                    logic: (location, filters) => {
                        if (filters.length) return !filters.includes(location);
                        return false;
                    },
                    display: (filterList, onChange, index, column) => {
                        return (
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Availability</FormLabel>
                                <RadioGroup row aria-label="available" name="available" value={filterList[index]} onChange={event => {
                                    filterList[index] = event.target.value;
                                    onChange(filterList[index], index, column);
                                }} >
                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl >
                        );
                    }
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    // console.log()
                    return (
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="available" name="available" value={entries[tableMeta.rowIndex].a} onChange={async (change) => { console.log('available=', change); }} >
                                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                <FormControlLabel value={false} control={<Radio />} label="No" />
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
                        <ChipInput value={entries[tableMeta.rowIndex].synonyms}
                            allowDuplicates={false}
                            onAdd={(chip) => handleAddSynonym(chip)}
                            onDelete={(chip, index) => handleDeleteSynonym(chip, index)}
                        />
                    );
                }
            }
        }
    ];

    const handleAddSynonym = (chip) => {

    }

    const handleDeleteSynonym = (chip, index) => {

    }

    const handleOrderableChange = (data) => {

    }

    const handleHasCount = () => {

    }

    const facilitySettings = (data) => {
        let location = node(data.name + '_location');
        let timings = node(data.name + '_timings');
        let price = node(data.name + '_price');
        return (
            <Paper variant="outlined" className={classes.control}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField d="standard-number" fullWidth disabled={isEqual(data.a, false)} label='"Yes" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={data.msg.yes} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField d="standard-number" fullWidth disabled={isEqual(data.a, true)} label='"No" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={data.msg.no} />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField d="standard-number" fullWidth disabled={isEqual(data.a, false)} label='"Location" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={location.msg} />
                </Grid>
                <Grid item xs={12}>
                    <TextField d="standard-number" fullWidth disabled={isEqual(data.a, false)} label='"Time" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={timings.msg} />
                </Grid>
                <Grid item xs={12}>
                    <TextField d="standard-number" fullWidth disabled={isEqual(data.a, false)} label='"Price" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={price.msg} />
                </Grid>
            </Paper >
        );
    }

    const policySettings = (data) => {
        return (
            <Paper variant="outlined" className={classes.control}>
                <Grid item xs={12}>
                    <TextField d="standard-number" fullWidth disabled={isEqual(data.a, false)} label='"No" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={data.msg} />
                </Grid>
            </Paper >
        );
    }

    const roomitemSettings = (data) => {
        return (
            <Paper variant="outlined" className={classes.control}>
                <Grid container spacing={3}>
                    <Grid container>
                        <Grid item xs={3}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Orderable</FormLabel>
                                <RadioGroup row defaultValue={data.o} aria-label="orderable" name="customized-radios" onChange={async (change) => { console.log(change); }} >
                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel control={<Checkbox checked={true} onChange={handleHasCount} inputProps={{ "aria-label": "primary checkbox" }} />} label="Has count" />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl component="fieldset">
                                <TextField d="standard-number" label="Limit" type="number" InputLabelProps={{ shrink: true }} defaultValue={has(data, 'limit') ? data.limit.count : ''} />
                                <RadioGroup row defaultValue={has(data, 'limit') ? 'day' : 'stay'} aria-label="type" name="customized-radios" onChange={async (change) => { console.log(change); }}>
                                    <FormControlLabel value='stay' control={<Radio />} label="Stay" />
                                    <FormControlLabel value='day' control={<Radio />} label="Day" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField d="standard-number" fullWidth disabled={isEqual(data.a, false)} label='"Yes" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={data.msg.yes} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField d="standard-number" fullWidth disabled={isEqual(data.a, true)} label='"No" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={data.msg.no} />
                    </Grid>
                </Grid>
            </Paper >
        )
    }

    const menuitemSettings = (data) => {
        console.log('+++data=', data);
        return (
            <Paper variant="outlined" className={classes.control}>
                <Grid container spacing={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Orderable</FormLabel>
                                <RadioGroup row defaultValue={data.o} aria-label="orderable" name="customized-radios" onChange={async (change) => { console.log(change); }} >
                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Type</FormLabel>
                                <RadioGroup row defaultValue={has(data, 'e') && isEqual(data.e, true) ? 'Eatable' : 'Drink'} aria-label="type" name="customized-radios" onChange={async (change) => { console.log(change); }}>
                                    <FormControlLabel value="Eatable" control={<Radio />} label="Eatable" />
                                    <FormControlLabel value="Drink" control={<Radio />} label="Drink" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <FormControlLabel control={<Checkbox checked={true} onChange={handleHasCount} inputProps={{ "aria-label": "primary checkbox" }} />} label="Has count" />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField d="standard-number" label="Quantity" type="number" InputLabelProps={{ shrink: true }} defaultValue={data.quantity} />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField d="standard-number" label="Price" type="number" InputLabelProps={{ shrink: true }} defaultValue={data.price} />
                        </Grid>
                    </Grid>
                </Grid>
            </Paper >
        );
    }

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
        setTableProps: () => {
            return {
                padding: "default",
                size: "small"
            }
        },
        onRowsExpand: (curExpanded, allExpanded) => console.log('ROW EXPANDED:', curExpanded, allExpanded),
        onTableChange: (action, state) => {
            console.log('action=', action, 'state=', state);
            // Calculate the unservedOrderCount and set it
            switch (action) {
                case 'changePage':
                    // changePage(state.page);
                    break;
            }
        },
        renderExpandableRow: (rowData, rowMeta) => {
            let render;
            console.log('++rowData=', rowData, ', +++rowMeta=', entries[rowMeta.dataIndex].type);
            let data = entries[rowMeta.dataIndex];
            if (isEqual(entries[rowMeta.dataIndex].type, 'Facility')) {
                render = facilitySettings(data);
            } if (isEqual(entries[rowMeta.dataIndex].type, 'Policy')) {
                render = policySettings(data);
            } if (isEqual(entries[rowMeta.dataIndex].type, 'Menu')) {
                console.log('Menu item...');
                render = menuitemSettings(data);
            } if (isEqual(entries[rowMeta.dataIndex].type, 'Room')) {
                render = roomitemSettings(data);
            }
            const colSpan = rowData.length + 1;
            return (
                <TableRow>
                    <TableCell colSpan={colSpan}>
                        {render}
                    </TableCell>
                </TableRow>
            );
        }
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