/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState } from 'react';
import {
    RadioGroup, Radio, FormControlLabel, FormControl, FormLabel, Grid, Paper, Checkbox,
    Dialog, Typography, Button, CssBaseline, FormGroup, IconButton
} from '@material-ui/core/';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from "@material-ui/core/styles";
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import { isUndefined, isEqual, has, remove, concat } from 'lodash';
import ChipInput from 'material-ui-chip-input';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';

import { APICall } from '../../utils/API';
import { node, createFaciliy } from './GraphOps';

const useStyles = makeStyles((theme) => ({
    control: {
        padding: 20,
        marginTop: 15,
        background: "#ffe"
    },
    toggleContainer: {
        margin: theme.spacing(2, 0),
    },
}));

const handleHasCountChange = () => {

}

export const FacilitySettings = (props) => {
    const [edit, setEdit] = useState(props.edit);
    let location, timings, price;
    if (has(props, 'data')) {
        location = node(props.data.name + '_location');
        timings = node(props.data.name + '_timings');
        price = node(props.data.name + '_price');
    }

    const [facility, setFacility] = useState(
        has(props, 'data') ?
            {
                name: props.data.name,
                a: props.data.a,
                o: props.data.o,
                synonyms: props.data.synonyms,
                msg: { yes: props.data.msg.yes, no: props.data.msg.no },
                location: location,
                timings: timings,
                price: price
            } :
            { name: '', a: '', o: '', synonyms: [], msg: { yes: '', no: '' }, location: { msg: '' }, timings: { msg: '' }, price: { msg: '' } }
    );

    const handleAddSynonym = (chip) => {
        setFacility({ ...facility, synonyms: concat(facility.synonyms, chip) });
    }

    const handleDeleteSynonym = (chip, index) => {
        setFacility({ ...facility, synonyms: facility.synonyms.splice(index, 1) });
    }

    const initialValues = () => {
        console.log('initialValues=', facility);
        return facility;
    }

    const validate = values => {
        const errors = {};
        // const errors = { msg: { yes: {}, no: {} }, location: { msg: {} }, timings: { msg: {} }, price: { msg: {} } };
        console.log('validate:', edit, values, errors);

        console.log('validating fields');
        if (!values.name) {
            errors.name = 'Required';
        }
        if (!values.a) {
            errors.a = 'Required';
        }
        if (!values.o) {
            errors.o = 'Required';
        }
        if (!values.msg_yes) {
            errors.msg_yes = 'Required';
        }
        if (!values.msg_no) {
            errors.msg_no = 'Required';
        }
        if (!values.location_msg) {
            errors.location_msg = 'Required';
        }
        if (!values.timings_msg) {
            errors.timings_msg = 'Required';
        }
        if (!values.price_msg) {
            errors.price_msg = 'Required';
        }

        return errors;
    }

    const saveFacility = async values => {
        console.log('saveFacility');
        let f = {
            name: values.name,
            a: isEqual(values.a, 'Yes') ? true : false,
            o: isEqual(values.o, 'Yes') ? true : false,
            synonyms: facility.synonyms,
            msg: values.msg,
            location: values.location,
            timings: values.timings,
            price: values.price
        };

        let res = null;
        try {
            res = await createFaciliy(f);
        } catch (error) {
            console.log('error in creating facility:', error);
        }
        props.onFacilitySaved(res);
    };

    const classes = useStyles();

    console.log('FacilitySetting::', props);
    return (
        <Form
            onSubmit={saveFacility}
            validate={validate}
            initialValues={initialValues()}
            render={({ handleSubmit, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Grid item xs={12}>
                            <IconButton aria-label="save" variant="contained" color="primary" type="submit" disabled={submitting} className={classes.margin} >
                                <SaveRoundedIcon color="secondary" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper variant="outlined" className={classes.control} >
                                <Grid container spacing={2} direction="column" justify="center" alignItems="stretch">
                                    {
                                        !isEqual(edit, true) &&
                                        <Grid container spacing={3} direction="row" justify="space-around" alignItems="center">
                                            <Grid item xs={3}>
                                                <Field required name="name" component={TextField} type="text" label="Name" />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormLabel component="legend">Availability</FormLabel>
                                                <Grid container direction="row" justify="center" alignItems="center">
                                                    <Grid item xs={6}>
                                                        <FormLabel component="legend">Yes</FormLabel>
                                                        <Field name="a" component="input" type="radio" value="Yes" />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel component="legend">No</FormLabel>
                                                        <Field name="a" component="input" type="radio" value="No" />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormLabel component="legend">Orderabble</FormLabel>
                                                <Grid container direction="row" justify="center" alignItems="center">
                                                    <Grid item xs={6}>
                                                        <FormLabel component="legend">Yes</FormLabel>
                                                        <Field name="o" component="input" type="radio" value="Yes" />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormLabel component="legend">No</FormLabel>
                                                        <Field name="o" component="input" type="radio" value="No" />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormLabel component="legend">Synonyms</FormLabel>
                                                <ChipInput
                                                    fullWidth
                                                    allowDuplicates={false}
                                                    onAdd={(chip) => handleAddSynonym(chip)}
                                                    onDelete={(chip, index) => handleDeleteSynonym(chip, index)}
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                    <Grid item xs={12}>
                                        <Field required fullWidth name="msg_yes" component={TextField} type="text" label='"Yes" Message' />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field required fullWidth name="msg_no" component={TextField} type="text" label='"No" Message' />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field required fullWidth name="location_msg" component={TextField} type="text" label='"Location" Message' />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field required fullWidth name="timings_msg" component={TextField} type="text" label='"Timing" Message' />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field required fullWidth name="price_msg" component={TextField} type="text" label='"Price" Message' />
                                </Grid>
                            </Paper >
                        </Grid>
                    </Grid>
                </form>
            )}
        />
    );
}

export const PolicySettings = (props) => {
    const handleAddSynonym = (chip) => {

    }

    const handleDeleteSynonym = (chip, index) => {

    }

    const savePolicy = () => {

    }

    const classes = useStyles();
    return (
        <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12}>
                <IconButton aria-label="save" className={classes.margin} onClick={savePolicy} >
                    <SaveRoundedIcon color="secondary" />
                </IconButton>
            </Grid>
            <Grid item xs={12}>
                <Paper variant="outlined" className={classes.control} >
                    <Grid container spacing={2} direction="column" justify="center" alignItems="stretch">
                        {
                            !has(props, 'data') &&
                            <Grid container spacing={2} direction="row" justify="center" alignItems="stretch">
                                <Grid item xs={6}>
                                    <TextField d="standard-number" required label='Name' type="text" InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Available</FormLabel>
                                        <RadioGroup required row aria-label="available" name="available" value={true} onChange={async (change) => { console.log('available=', change); }} >
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormLabel component="legend">Synonyms</FormLabel>
                                    <ChipInput
                                        fullWidth
                                        allowDuplicates={false}
                                        onAdd={(chip) => handleAddSynonym(chip)}
                                        onDelete={(chip, index) => handleDeleteSynonym(chip, index)}
                                    />
                                </Grid>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <TextField d="standard-number" fullWidth label='"Policy" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={!has(props, 'data') ? '' : props.data.msg} />
                        </Grid>
                    </Grid>
                </Paper >
            </Grid>
        </Grid>
    );
}

export const RoomitemSettings = (props) => {
    const handleAddSynonym = (chip) => {

    }

    const handleDeleteSynonym = (chip, index) => {

    }

    const saveRoomitem = () => {

    }

    const classes = useStyles();
    return (
        <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12}>
                <IconButton aria-label="save" className={classes.margin} onClick={saveRoomitem} >
                    <SaveRoundedIcon color="secondary" />
                </IconButton>
            </Grid>
            <Grid item xs={12}>
                <Paper variant="outlined" className={classes.control} >
                    <Grid container spacing={3} direction="row" justify="center" alignItems="stretch">
                        {
                            !has(props, 'data') &&
                            <Grid container spacing={3} direction="row" justify="center" alignItems="center">
                                <Grid item xs={6}>
                                    <TextField d="standard-number" required label='Name' type="text" InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Available</FormLabel>
                                        <RadioGroup required row aria-label="available" name="available" value={true} onChange={async (change) => { console.log('available=', change); }} >
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormLabel component="legend">Synonyms</FormLabel>
                                    <ChipInput
                                        fullWidth
                                        allowDuplicates={false}
                                        onAdd={(chip) => handleAddSynonym(chip)}
                                        onDelete={(chip, index) => handleDeleteSynonym(chip, index)}
                                    />
                                </Grid>
                            </Grid>
                        }
                        <Grid container direction="row" justify="space-around" alignItems="center" >
                            <Grid item xs={3}>
                                <FormControlLabel control={<Checkbox checked={true} onChange={handleHasCountChange} inputProps={{ "aria-label": "primary checkbox" }} />} label="Has count" />
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Orderable</FormLabel>
                                    <RadioGroup row defaultValue={isUndefined(props.data) ? '' : props.data.o} aria-label="orderable" name="customized-radios" onChange={async (change) => { console.log(change); }} >
                                        <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                        <FormControlLabel value={false} control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl component="fieldset">
                                    <TextField d="standard-number" label="Limit" type="number" InputLabelProps={{ shrink: true }} defaultValue={isUndefined(props.data) ? '' : (has(props.data, 'limit') ? props.data.limit.count : '')} />
                                    <RadioGroup row defaultValue={isUndefined(props.data) ? '' : (has(props.data, 'limit') ? 'day' : 'stay')} aria-label="type" name="customized-radios" onChange={async (change) => { console.log(change); }}>
                                        <FormControlLabel value='stay' control={<Radio />} label="Stay" />
                                        <FormControlLabel value='day' control={<Radio />} label="Day" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField d="standard-number" fullWidth label='"Yes" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={!has(props, 'data') ? '' : props.data.msg.yes} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField d="standard-number" fullWidth label='"No" Message' type="text" InputLabelProps={{ shrink: true }} defaultValue={!has(props, 'data') ? '' : props.data.msg.no} />
                        </Grid>
                    </Grid>
                </Paper >
            </Grid>
        </Grid>
    );
}

export const MenuitemSettings = (props) => {
    const handleAddSynonym = (chip) => {

    }

    const handleDeleteSynonym = (chip, index) => {

    }

    const saveMenuitem = () => {

    }

    const classes = useStyles();
    console.log('+++data=', props);
    return (
        <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12}>
                <IconButton aria-label="save" className={classes.margin} onClick={saveMenuitem} >
                    <SaveRoundedIcon color="secondary" />
                </IconButton>
            </Grid>
            <Grid item xs={12}>
                <Paper variant="outlined" className={classes.control} >
                    <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                        {
                            !has(props, 'data') &&
                            <Grid container spacing={3} direction="row" justify="center" alignItems="stretch">
                                <Grid item xs={6}>
                                    <TextField d="standard-number" required label='Name' type="text" InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Available</FormLabel>
                                        <RadioGroup required row aria-label="available" name="available" value={true} onChange={async (change) => { console.log('available=', change); }} >
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormLabel component="legend">Synonyms</FormLabel>
                                    <ChipInput
                                        fullWidth
                                        allowDuplicates={false}
                                        onAdd={(chip) => handleAddSynonym(chip)}
                                        onDelete={(chip, index) => handleDeleteSynonym(chip, index)}
                                    />
                                </Grid>
                            </Grid>
                        }
                        <Grid container direction="row" justify="space-around" alignItems="center" >
                            <Grid item xs={3}>
                                <FormControlLabel control={<Checkbox checked={true} onChange={handleHasCountChange} inputProps={{ "aria-label": "primary checkbox" }} />} label="Has count" />
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Orderable</FormLabel>
                                    <RadioGroup row defaultValue={isUndefined(props.data) ? '' : props.data.o} aria-label="orderable" name="customized-radios" onChange={async (change) => { console.log(change); }} >
                                        <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                        <FormControlLabel value={false} control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Type</FormLabel>
                                    <RadioGroup row defaultValue={isUndefined(props.data) ? '' : (has(props.data, 'e') && isEqual(props.data.e, true) ? 'Eatable' : 'Drink')} aria-label="type" name="customized-radios" onChange={async (change) => { console.log(change); }}>
                                        <FormControlLabel value="Eatable" control={<Radio />} label="Eatable" />
                                        <FormControlLabel value="Drink" control={<Radio />} label="Drink" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField d="standard-number" label="Quantity" type="number" InputLabelProps={{ shrink: true }} defaultValue={isUndefined(props.data) ? '' : props.data.quantity} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField d="standard-number" label="Price" type="number" InputLabelProps={{ shrink: true }} defaultValue={isUndefined(props.data) ? '' : props.data.price} />
                        </Grid>
                    </Grid>
                </Paper >
            </Grid>
        </Grid>
    );
}

export const AddSetting = (props) => {
    const [open, setOpen] = useState(true);
    const [setting, setSetting] = useState('');

    const handleSettingChange = (event) => {
        console.log(event.target.value);
        setSetting(event.target.value);
    };

    const handleClose = (result) => {
        props.onSettingAdded(result); // This would reset the flag to open the dialog
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogContent>
                <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
                    <CssBaseline />
                    <Typography variant="h5" align="center" component="h2" gutterBottom>
                        <SettingsRoundedIcon />Add Setting
                    </Typography>
                    <Grid container direction="row" justify="center" alignItems="center" >
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="setting" name="setting" value={setting} onChange={handleSettingChange}>
                                <FormControlLabel value="policy" control={<Radio />} label="Policy" />
                                <FormControlLabel value="facility" control={<Radio />} label="Facility" />
                                <FormControlLabel value="menuitem" control={<Radio />} label="Menu Item" />
                                <FormControlLabel value="roomitem" control={<Radio />} label="Room Item" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {isEqual(setting, 'policy') && <PolicySettings />}
                    {isEqual(setting, 'facility') && <FacilitySettings onFacilitySaved={handleClose} />}
                    {isEqual(setting, 'menuitem') && <MenuitemSettings />}
                    {isEqual(setting, 'roomitem') && <RoomitemSettings />}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary"> Cancel </Button>
            </DialogActions>
        </Dialog>
    );
}