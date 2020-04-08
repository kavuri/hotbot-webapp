/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import Select from 'react-select';
import DialogActions from '@material-ui/core/DialogActions';
import {
    Typography,
    Paper,
    Grid,
    Button,
    CssBaseline,
    FormLabel,
} from '@material-ui/core';
import HomeWorkRoundedIcon from '@material-ui/icons/HomeWorkRounded';
import { isUndefined } from 'lodash';

import { APICall } from '../../utils/API';
import { states, cities } from './statesAndCities';

export default (props) => {
    const [open, setOpen] = useState(true);
    const [group, setGroup] = useState(props.group);
    const [hotel, setHotel] = useState(props.hotel);
    const [edit, setEdit] = useState(props.edit);
    const [selectedState, setSelectedState] = useState(undefined);

    const handleClose = () => {
        props.onHotelAdded(null); // This would reset the flag to open the dialog
        setOpen(false);
    };

    const onSubmit = async values => {
        let obj = {
            name: values.name,
            description: values.description,
            address: {
                address1: values.address1,
                address2: values.address2,
                city: values.city.label,
                state: values.state.label,
                pin: values.pincode,
                country: 'India'
            },
            contact: {
                phone: [values.phone],
                email: [values.email]
            },
            coordinates: {
                lat: values.lat,
                lng: values.lng
            },
            front_desk_count: values.frontDeskCount,
            reception_number: values.frontDeskPhone
        };

        let result = null;
        try {
            if (edit) {
                result = await APICall('/hotel/' + hotel._id, { method: 'PATCH', body: obj });
            } else {
                result = await APICall('/hotel', { method: 'POST', body: obj, keyValues: { group_id: group.group_id } });
            }
        } catch (err) {
            console.log('API error:', err);
            //FIXME: Should something be done here?
        }
        setOpen(false);
        props.onHotelAdded(result);
    };

    const validate = values => {
        const errors = {};
        if (values.state) { // For state selection
            setSelectedState(values.state);
        }

        if (!values.name) {
            errors.name = 'Required';
        }
        if (!values.email) {
            errors.email = 'Required';
        }
        if (!values.phone) {
            errors.phone = 'Required';
        }
        if (!values.address1) {
            errors.address1 = 'Required';
        }
        if (!values.address2) {
            errors.address2 = 'Required';
        }
        if (!values.state) {
            errors.state = 'Required';
        }
        if (!values.city) {
            errors.city = 'Required';
        }
        if (!values.pincode) {
            errors.pincode = 'Required';
        }
        if (!values.lat) {
            errors.lat = 'Required';
        }
        if (!values.lng) {
            errors.lng = 'Required';
        }
        if (!values.frontDeskCount) {
            errors.frontDeskCount = 'Required';
        }
        if (!values.frontDeskPhone) {
            errors.frontDeskPhone = 'Required';
        }
        return errors;
    };

    const initialValues = () => {
        let obj = {};
        if (!isUndefined(hotel)) {
            obj = {
                name: hotel.name,
                description: hotel.description,
                phone: hotel.contact.phone[0],
                email: hotel.contact.email[0],
                address1: hotel.address.address1,
                address2: hotel.address.address2,
                state: hotel.address.state,
                city: hotel.address.city,
                pincode: hotel.address.pin,
                lat: hotel.coordinates.lat,
                lng: hotel.coordinates.lng,
                frontDeskCount: hotel.front_desk_count,
                frontDeskPhone: hotel.reception_number
            }
        }
        return obj;
    };

    const ReactSelectAdapter = ({ input, ...rest }) => {
        return <Select {...input} {...rest} searchable />
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogContent>
                <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
                    <CssBaseline />
                    <Typography variant="h5" align="center" component="h2" gutterBottom>
                        <HomeWorkRoundedIcon />Add Hotel Details
                    </Typography>

                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        initialValues={initialValues()}
                        render={({ handleSubmit, reset, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit} noValidate>
                                <Paper style={{ padding: 16 }}>
                                    <Grid container alignItems="flex-start" spacing={2}>
                                        <Grid item xs={6}>
                                            <Field
                                                fullWidth
                                                required
                                                disabled={edit}
                                                name="name"
                                                component={TextField}
                                                type="text"
                                                label="Hotel Name"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                fullWidth
                                                name="description"
                                                component={TextField}
                                                type="text"
                                                label="Description"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                name="email"
                                                fullWidth
                                                required
                                                component={TextField}
                                                type="email"
                                                label="Email"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                name="phone"
                                                fullWidth
                                                required
                                                component={TextField}
                                                type="text"
                                                label="Phone"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Paper variant="outlined">
                                                <FormLabel component="legend">Address</FormLabel>
                                                <Grid container alignItems="flex-start" spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Field
                                                            name="address1"
                                                            fullWidth
                                                            required
                                                            component={TextField}
                                                            type="text"
                                                            label="Address1"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Field
                                                            name="address2"
                                                            fullWidth
                                                            required
                                                            component={TextField}
                                                            type="text"
                                                            label="Address2"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Field
                                                            fullWidth
                                                            name="state"
                                                            placeholder={'Select State'}
                                                            required
                                                            component={ReactSelectAdapter}
                                                            options={states()}
                                                            formControlProps={{ fullWidth: true }}
                                                        >
                                                        </Field>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Field
                                                            fullWidth
                                                            name="city"
                                                            placeholder={'Select City'}
                                                            required
                                                            component={ReactSelectAdapter}
                                                            options={isUndefined(selectedState) ? [] : cities(selectedState.label)}
                                                            formControlProps={{ fullWidth: true }}
                                                        >
                                                        </Field>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Field
                                                            name="pincode"
                                                            fullWidth
                                                            required
                                                            component={TextField}
                                                            type="text"
                                                            label="Pin Code"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Paper variant="outlined">
                                                <FormLabel component="legend">Coordinates</FormLabel>
                                                <Grid container alignItems="flex-start" spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Field
                                                            name="lat"
                                                            fullWidth
                                                            required
                                                            component={TextField}
                                                            type="text"
                                                            label="Latitude"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Field
                                                            name="lng"
                                                            fullWidth
                                                            required
                                                            component={TextField}
                                                            type="text"
                                                            label="Longitude"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Field
                                                fullWidth
                                                required
                                                name="frontDeskCount"
                                                component={TextField}
                                                type="number"
                                                label="Front Desk Count"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                fullWidth
                                                required
                                                name="frontDeskPhone"
                                                component={TextField}
                                                type="text"
                                                label="Front desk number"
                                            />
                                        </Grid>
                                        <Grid item style={{ marginTop: 16 }}>
                                            <Button
                                                type="button"
                                                variant="contained"
                                                onClick={reset}
                                                disabled={submitting || pristine}
                                            >
                                                Reset
                                            </Button>
                                        </Grid>
                                        <Grid item style={{ marginTop: 16 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={submitting}
                                            >
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </form>
                        )}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary"> Cancel </Button>
            </DialogActions>
        </Dialog>
    );
}
