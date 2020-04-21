/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import DialogActions from '@material-ui/core/DialogActions';
import {
    Typography,
    Paper,
    Grid,
    Button,
    CssBaseline,
} from '@material-ui/core';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import { isUndefined } from 'lodash';

import { APICall } from '../../utils/API';

export default (props) => {
    const [open, setOpen] = useState(true);
    const [hotel, setHotel] = useState(props.hotel);
    const [room, setRoom] = useState(props.room);
    const [edit, setEdit] = useState(props.edit);

    const handleClose = () => {
        props.onRoomAdded(null); // This would reset the flag to open the dialog
        setOpen(false);
    };

    const onSubmit = async values => {
        let obj = {
            room_no: values.room_no,
            type: values.type
        };

        let result = null;
        try {
            if (edit) {
                result = await APICall('/room/' + room._id, { method: 'PATCH', body: obj });
            } else {
                result = await APICall('/room', { method: 'POST', body: obj, keyValues: { hotel_id: hotel.hotel_id } });
            }
        } catch (error) {
            //FIXME: Do something?
        }
        setOpen(false);
        props.onRoomAdded(result);
    };

    const validate = values => {
        const errors = {};
        if (!values.room_no) {
            errors.room_no = 'Required';
        }
        if (!values.type) {
            errors.type = 'Required';
        }
        return errors;
    };

    const initialValues = () => {
        let obj = {};
        if (!isUndefined(room)) {
            obj = {
                room_no: room.room_no,
                type: room.type
            };
        }
        return obj;
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogContent>
                <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
                    <CssBaseline />
                    <Typography variant="h5" align="center" component="h2" gutterBottom>
                        <HomeRoundedIcon />Create Room
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
                                                name="room_no"
                                                component={TextField}
                                                type="text"
                                                label="Room Number"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                fullWidth
                                                name="type"
                                                component={TextField}
                                                type="text"
                                                label="Room Type (like deluxe, supreme)"
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