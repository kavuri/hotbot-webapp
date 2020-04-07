/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Form, Field } from 'react-final-form';
import { TextField, Select } from 'final-form-material-ui';
import DialogActions from '@material-ui/core/DialogActions';
import {
    Typography,
    Paper,
    Grid,
    Button,
    CssBaseline,
    FormLabel,
    MenuItem,
} from '@material-ui/core';
import HomeWorkRoundedIcon from '@material-ui/icons/HomeWorkRounded';

import { createHotel } from '../../utils/API';

export default (props) => {
    const [open, setOpen] = useState(true);
    const [group, setGroup] = useState(props.group);

    const handleClose = () => {
        props.onHotelAdded(); // This would reset the flag to open the dialog
        setOpen(false);
    };

    const onSubmit = async values => {
        let obj = {
            name: values.name,
            description: values.description,
            address: {
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                state: values.state,
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

        let result = await createHotel(group.group_id, obj);
        setOpen(false);
        props.onHotelAdded(result);
    };

    const validate = values => {
        const errors = {};
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
                        render={({ handleSubmit, reset, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit} noValidate>
                                <Paper style={{ padding: 16 }}>
                                    <Grid container alignItems="flex-start" spacing={2}>
                                        <Grid item xs={6}>
                                            <Field
                                                fullWidth
                                                required
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
                                                            required
                                                            component={Select}
                                                            label="Select a State"
                                                            formControlProps={{ fullWidth: true }}
                                                        >
                                                            <MenuItem value="London">London</MenuItem>
                                                            <MenuItem value="Paris">Paris</MenuItem>
                                                            <MenuItem value="Budapest">
                                                                A city with a very long Name
                                                            </MenuItem>
                                                        </Field>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Field
                                                            fullWidth
                                                            name="city"
                                                            required
                                                            component={Select}
                                                            label="Select a City"
                                                            formControlProps={{ fullWidth: true }}
                                                        >
                                                            <MenuItem value="London">London</MenuItem>
                                                            <MenuItem value="Paris">Paris</MenuItem>
                                                            <MenuItem value="Budapest">
                                                                A city with a very long Name
                                                            </MenuItem>
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
                {/* <Button onClick={handleStatusChange} color="primary" autoFocus> Confirm </Button> */}
            </DialogActions>
        </Dialog>
    );
}