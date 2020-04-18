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
import { isEmpty, isEqual, has, pullAt, concat } from 'lodash';
import ChipInput from 'material-ui-chip-input';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import { useSnackbar } from 'notistack';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';

import { APICall } from '../../utils/API';

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
    const [hotel, setHotel] = useState(props.hotel);
    const { enqueueSnackbar } = useSnackbar();
    const [synonyms, setSynonyms] = useState(isEqual(edit, true) ? props.data.synonyms : []);
    const [facility, setFacility] = useState(
        has(props, 'data') ?
            {
                name: props.data.name,
                a: props.data.a,
                o: props.data.o,
                msg_yes: props.data.msg.yes,
                msg_no: props.data.msg.no,
                location_msg: props.data.location.msg,
                timings_msg: props.data.timings.msg,
                price_msg: props.data.price.msg
            } :
            { name: '', a: '', o: '', msg_yes: '', msg_no: '', location_msg: '', timings_msg: '', price_msg: '' }
    );

    const handleAddSynonym = (chip) => {
        console.log('+++', facility);
        if (chip.length < 3) {
            enqueueSnackbar('Minimum length of 3 characters required', { variant: 'error' });
            return;
        }
        setSynonyms(concat(synonyms, chip));
    }

    const handleDeleteSynonym = (chip, index) => {
        pullAt(synonyms, index);
        setSynonyms(synonyms);
    }

    const validate = values => {
        const errors = {};
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
        console.log('saveFacility:', facility);
        let f = {
            name: values.name,
            f: true,
            a: isEqual(values.a, 'Yes') ? true : false,
            o: isEqual(values.o, 'Yes') ? true : false,
            synonyms: synonyms,
            msg: { yes: values.msg_yes, no: values.msg_no },
            location: { msg: values.location_msg },
            timings: { msg: values.timings_msg },
            price: { msg: values.price_msg }
        };

        let res = null;
        try {
            if (edit) {
                res = await APICall('/item', { method: 'PUT', body: f, keyValues: { hotel_id: hotel.id } });
            } else {
                res = await APICall('/item', { method: 'POST', body: f, keyValues: { hotel_id: hotel.id } });
            }
        } catch (error) {
            console.log('error in creating facility:', error);
        }
        props.onItemSaved(f);
    };

    const classes = useStyles();

    return (
        <Form
            onSubmit={saveFacility}
            validate={validate}
            initialValues={facility}
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
                                                    placeholder="Type synonym and press enter"
                                                    allowDuplicates={false}
                                                    value={synonyms}
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
    const [edit, setEdit] = useState(props.edit);
    const [hotel, setHotel] = useState(props.hotel);
    const [synonyms, setSynonyms] = useState(isEqual(edit, true) ? props.data.synonyms : []);
    const [policy, setPolicy] = useState(
        has(props, 'data') ?
            {
                name: props.data.name,
                a: props.data.a,
                msg: props.data.msg,
            } :
            { name: '', a: '', msg: '' }
    );
    const { enqueueSnackbar } = useSnackbar();

    const handleAddSynonym = (chip) => {
        if (chip.length < 3) {
            enqueueSnackbar('Minimum length of 3 characters required', { variant: 'error' });
            return;
        }
        setSynonyms(concat(synonyms, chip));
    }

    const handleDeleteSynonym = (chip, index) => {
        pullAt(synonyms, index);
        setSynonyms(synonyms);
    }

    const validate = values => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Required';
        }
        if (!values.a) {
            errors.a = 'Required';
        }
        if (!values.msg) {
            errors.msg = 'Required';
        }

        return errors;
    }

    const savePolicy = async values => {
        console.log('savePolicy:', values, synonyms);
        let p = {
            name: values.name,
            p: true,
            a: isEqual(values.a, 'Yes') ? true : false,
            synonyms: synonyms,
            msg: values.msg
        };


        let res = null;
        try {
            if (edit) {
                res = await APICall('/item', { method: 'PUT', body: p, keyValues: { hotel_id: hotel.id } });
            } else {
                res = await APICall('/item', { method: 'POST', body: p, keyValues: { hotel_id: hotel.id } });
            }
        } catch (error) {
            console.log('error in creating facility:', error);
        }
        props.onItemSaved(p);
    };

    const classes = useStyles();
    return (
        <Form
            onSubmit={savePolicy}
            validate={validate}
            initialValues={policy}
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
                                        <Grid container spacing={2} direction="row" justify="center" alignItems="stretch">
                                            <Grid item xs={6}>
                                                <Field required name="name" component={TextField} type="text" label="Name" />
                                            </Grid>
                                            <Grid item xs={6}>
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
                                            <Grid item xs={12}>
                                                <FormLabel component="legend">Synonyms</FormLabel>
                                                <ChipInput
                                                    fullWidth
                                                    placeholder="Type synonym and press enter"
                                                    allowDuplicates={false}
                                                    value={synonyms}
                                                    onAdd={(chip) => handleAddSynonym(chip)}
                                                    onDelete={(chip, index) => handleDeleteSynonym(chip, index)}
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                    <Grid item xs={12}>
                                        <Field required fullWidth name="msg" component={TextField} type="text" label='Message' />
                                    </Grid>
                                </Grid>
                            </Paper >
                        </Grid>
                    </Grid>
                </form>
            )}
        />
    );
}

export const RoomitemSettings = (props) => {
    const [edit, setEdit] = useState(props.edit);
    const [hotel, setHotel] = useState(props.hotel);
    const [synonyms, setSynonyms] = useState(isEqual(edit, true) ? props.data.synonyms : []);
    const [roomitem, setRoomitem] = useState(
        has(props, 'data') ?
            {
                name: props.data.name,
                a: props.data.a,
                c: [props.data.c],
                o: props.data.o,
                price: props.data.price,
                count: props.data.limit.count,
                per: props.data.limit.per,
                msg_yes: props.data.msg.yes,
                msg_no: props.data.msg.no,
            } :
            { name: '', a: true, o: true, price: '', c: '', count: '', per: '', msg_yes: '', msg_no: '' }
    );
    const { enqueueSnackbar } = useSnackbar();

    const handleAddSynonym = (chip) => {
        if (chip.length < 3) {
            enqueueSnackbar('Minimum length of 3 characters required', { variant: 'error' });
            return;
        }
        setSynonyms(concat(synonyms, chip));
    }

    const handleDeleteSynonym = (chip, index) => {
        pullAt(synonyms, index);
        setSynonyms(synonyms);
    }

    const validate = values => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Required';
        }
        if (!values.a) {
            errors.a = 'Required';
        }
        if (!values.o) {
            errors.o = 'Required';
        }
        if (!values.price) {
            errors.price = 'Required';
        }
        if (!values.c) {
            errors.c = 'Required';
        }
        if (!values.count) {
            errors.count = 'Required';
        }
        if (!values.per) {
            errors.per = 'Required';
        }
        if (!values.msg_yes) {
            errors.msg_yes = 'Required';
        }
        if (!values.msg_no) {
            errors.msg_no = 'Required';
        }

        return errors;
    }

    const saveRoomitem = async values => {
        console.log('saveRoomitem:', values, synonyms);
        let ri = {
            name: values.name,
            ri: true,
            a: isEqual(values.a, 'Yes') ? true : false,
            o: isEqual(values.o, 'Yes') ? true : false,
            c: isEmpty(values.c) ? false : true,
            price: values.price,
            synonyms: synonyms,
            limit: { count: values.count, per: values.per },
            msg: { yes: values.msg_yes, no: values.msg_no }
        };

        let res = null;
        try {
            if (edit) {
                res = await APICall('/item', { method: 'PUT', body: ri, keyValues: { hotel_id: hotel.id } });
            } else {
                res = await APICall('/item', { method: 'POST', body: ri, keyValues: { hotel_id: hotel.id } });
            }
        } catch (error) {
            console.log('error in creating facility:', error);
        }
        props.onItemSaved(ri);
    };

    const classes = useStyles();

    return (
        <Form
            onSubmit={saveRoomitem}
            validate={validate}
            initialValues={roomitem}
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
                                        <Grid container spacing={2} direction="row" justify="center" alignItems="stretch">
                                            <Grid item xs={6}>
                                                <Field required name="name" component={TextField} type="text" label="Name" />
                                            </Grid>
                                            <Grid item xs={6}>
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
                                            <Grid item xs={12}>
                                                <FormLabel component="legend">Synonyms</FormLabel>
                                                <ChipInput
                                                    fullWidth
                                                    placeholder="Type synonym and press enter"
                                                    allowDuplicates={false}
                                                    value={synonyms}
                                                    onAdd={(chip) => handleAddSynonym(chip)}
                                                    onDelete={(chip, index) => handleDeleteSynonym(chip, index)}
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                    <Grid container direction="row" justify="space-around" alignItems="center" >
                                        <Grid item xs={3}>
                                            <FormLabel component="legend">Orderable</FormLabel>
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
                                        <Grid item xs={3}>
                                            <Field required name="price" component={TextField} type="number" label="Price" />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormLabel component="legend">Has Count</FormLabel>
                                            <Field name="c" component="input" type="checkbox" value={true} />{' '}
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Field required name="count" component={TextField} parse={parseInt} type="number" label="Limit" />
                                            <FormLabel component="legend">Per</FormLabel>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Grid item xs={6}>
                                                    <FormLabel component="legend">Day</FormLabel>
                                                    <Field name="per" component="input" type="radio" value="Day" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormLabel component="legend">Stay</FormLabel>
                                                    <Field name="per" component="input" type="radio" value="Stay" />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field required fullWidth name="msg_yes" component={TextField} type="text" label='"Yes" Message' />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field required fullWidth name="msg_no" component={TextField} type="text" label='"No" Message' />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper >
                        </Grid>
                    </Grid>
                </form>
            )}
        />
    );
}

export const MenuitemSettings = (props) => {
    const [edit, setEdit] = useState(props.edit);
    const [hotel, setHotel] = useState(props.hotel);
    const [synonyms, setSynonyms] = useState(isEqual(edit, true) ? props.data.synonyms : []);
    const [menuitem, setMenuitem] = useState(
        has(props, 'data') ?
            {
                name: props.data.name,
                a: props.data.a,
                o: props.data.o,
                c: [props.data.c],
                mtype: props.data.mtype,
                price: props.data.price,
                qty: props.data.qty
            } :
            { name: '', a: true, o: true, price: '', c: '', mtype: '', qty: '' }
    );

    const { enqueueSnackbar } = useSnackbar();

    const handleAddSynonym = (chip) => {
        if (chip.length < 3) {
            enqueueSnackbar('Minimum length of 3 characters required', { variant: 'error' });
            return;
        }
        setSynonyms(concat(synonyms, chip));
    }

    const handleDeleteSynonym = (chip, index) => {
        pullAt(synonyms, index);
        setSynonyms(synonyms);
    }

    const validate = values => {
        {/* console.log('^^^validating:', typeof values.qty, values.price) */}
        const errors = {};

        if (!values.name) {
            errors.name = 'Required';
        }
        if (!values.a) {
            errors.a = 'Required';
        }
        if (!values.o) {
            errors.o = 'Required';
        }
        if (!values.c) {
            errors.c = 'Required';
        }
        if (!values.price) {
            errors.price = 'Required';
        }
        if (!values.mtype) {
            errors.mtype = 'Required';
        }
        if (!values.qty) {
            errors.qty = 'Required';
        }

        return errors;
    }

    const saveMenuitem = async values => {
        console.log('+++saveMenuitem:', values, '++', synonyms, '++', props.data, '--typeof', typeof values.price, typeof values.qty);
        let m = {
            name: values.name,
            m: true,
            a: isEqual(values.a, 'Yes') ? true : false,
            o: isEqual(values.o, 'Yes') ? true : false,
            c: isEmpty(values.c) ? false : true,
            mtype: values.mtype,
            price: values.price,
            synonyms: synonyms,
            qty: values.qty
        };

        let res = null;
        try {
            if (edit) {
                res = await APICall('/item', { method: 'PUT', body: m, keyValues: { hotel_id: hotel.id } });
            } else {
                res = await APICall('/item', { method: 'POST', body: m, keyValues: { hotel_id: hotel.id } });
            }
        } catch (error) {
            console.log('error in creating facility:', error);
        }
        props.onItemSaved(m);
    };

    const classes = useStyles();
    return (
        <Form
            onSubmit={saveMenuitem}
            validate={validate}
            initialValues={menuitem}
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
                                        <Grid container spacing={2} direction="row" justify="center" alignItems="stretch">
                                            <Grid item xs={6}>
                                                <Field required name="name" component={TextField} type="text" label="Name" />
                                            </Grid>
                                            <Grid item xs={6}>
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
                                            <Grid item xs={12}>
                                                <FormLabel component="legend">Synonyms</FormLabel>
                                                <ChipInput
                                                    fullWidth
                                                    placeholder="Type synonym and press enter"
                                                    allowDuplicates={false}
                                                    value={synonyms}
                                                    onAdd={(chip) => handleAddSynonym(chip)}
                                                    onDelete={(chip, index) => handleDeleteSynonym(chip, index)}
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                    <Grid container direction="row" justify="space-around" alignItems="center" >
                                        <Grid item xs={3}>
                                            <FormLabel component="legend">Orderable</FormLabel>
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
                                        <Grid item xs={3}>
                                            <FormLabel component="legend">Type</FormLabel>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Grid item xs={6}>
                                                    <FormLabel component="legend">Eatable</FormLabel>
                                                    <Field name="mtype" component="input" type="radio" value="e" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormLabel component="legend">Drink</FormLabel>
                                                    <Field name="mtype" component="input" type="radio" value="d" />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormLabel component="legend">Has Count</FormLabel>
                                            <Field name="c" component="input" type="checkbox" value={true} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field required name="qty" component={TextField} type="number" parse={parseInt} label="Quantity" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field required name="price" component={TextField} type="number" parse={parseInt} label="Price" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper >
                        </Grid>
                    </Grid>
                </form>
            )}
        />
    );
}

export const AddSetting = (props) => {
    const [open, setOpen] = useState(true);
    const [setting, setSetting] = useState('');
    const [hotel, setHotel] = useState(props.hotel);

    const handleSettingChange = (event) => {
        console.log(event.target.value);
        setSetting(event.target.value);
    };

    const handleClose = (result) => {
        props.onSettingCreated(result); // This would reset the flag to open the dialog
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
                    {isEqual(setting, 'policy') && <PolicySettings onItemSaved={handleClose} hotel={hotel} />}
                    {isEqual(setting, 'facility') && <FacilitySettings onItemSaved={handleClose} hotel={hotel} />}
                    {isEqual(setting, 'menuitem') && <MenuitemSettings onItemSaved={handleClose} hotel={hotel} />}
                    {isEqual(setting, 'roomitem') && <RoomitemSettings onItemSaved={handleClose} hotel={hotel} />}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary"> Cancel </Button>
            </DialogActions>
        </Dialog>
    );
}