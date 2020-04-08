/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import { TextField } from 'final-form-material-ui';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {
    Typography,
    Paper,
    Grid,
    Button,
    CssBaseline,
} from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import HomeWorkRoundedIcon from '@material-ui/icons/HomeWorkRounded';
import { isNull, isUndefined } from 'lodash';

import { createHotelGroup, APICall } from '../../utils/API';

export default (props) => {
    const [open, setOpen] = useState(true);

    const onSubmit = async values => {
        console.log('got submission for :', values)
        let obj = {
            name: values.name,
            description: values.description,
        };

        let hotelGroup = null;
        try {
            hotelGroup = await APICall('/hotelGroup', { method: 'POST', body: obj });
        } catch (error) {

        }
        setOpen(false);
        // if (isUndefined(hotelGroup) || isNull(hotelGroup)) return;

        props.onGroupAdded(hotelGroup);
    };

    const validate = values => {
        console.log('va;ue=', values)
        const errors = {};
        if (!values.name) {
            errors.name = 'Required';
        }
        console.log('errors=', errors);
        // return errors;
        return {};
    };

    const handleClose = () => {
        props.onGroupAdded();   // This would reset the flag to open the dialog
        setOpen(false);
        console.log('^^^^^^ CLOSING addGroup Dialog', open);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogContent>
                <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
                    <CssBaseline />
                    <Typography variant="h5" align="center" component="h2" gutterBottom>
                        <HomeWorkRoundedIcon />Add Hotel Group Details
                    </Typography>

                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        render={({ handleSubmit, reset, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit} noValidate>
                                <Paper style={{ padding: 16 }}>
                                    <Grid container alignItems="flex-start" spacing={2}>
                                        <Grid item xs={12}>
                                            <Field
                                                fullWidth
                                                required
                                                name="name"
                                                component={TextField}
                                                type="text"
                                                label="Hotel Group Name"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                fullWidth
                                                name="description"
                                                component={TextField}
                                                type="text"
                                                label="Description"
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