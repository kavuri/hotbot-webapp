/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
// src/components/Profile.js

import React, { useState, useContext, useEffect } from "react";
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';

import { isUndefined } from 'lodash';
import {
  Typography,
  Paper,
  Grid,
  Button,
  CssBaseline,
  FormLabel,
} from '@material-ui/core';

import { useSnackbar } from 'notistack';
import { useKamAppCtx } from './KamAppContext';

const Profile = (props) => {
  const [hotel, setHotel] = useState({});

  const { APICall } = useKamAppCtx();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    // Fetch my hotel
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    let result = null;
    try {
      result = await APICall('/hotel/myhotel', { method: 'GET' });
      let obj = {
        ...result,
        phone: result.contact.phone[0],
        email: result.contact.email[0],
        frontDeskCount: result.front_desk_count,
        frontDeskPhone: result.reception_number
      };
      console.log('++hotel=', obj)
      setHotel(obj);
    } catch (error) {
      enqueueSnackbar('Error fetching hotel data. Try again', { variant: 'error' });
    }
  }

  // FIXME: Updating hotel details needs to be fixed at UI and API
  const onSubmit = async values => {
    let obj = {
      contact: {
        email: [values.email]
      },
      front_desk_count: values.frontDeskCount,
      reception_number: values.frontDeskPhone
    };

    let result = null;
    try {
      result = await APICall('/hotel/' + hotel._id, { method: 'PATCH', body: obj });
    } catch (err) {
      console.log('API error:', err);
      enqueueSnackbar('Error updating details', { variant: 'error' });
    }
  };

  const validate = values => {
    const errors = {};
    if (!values.secondary_email) {
      errors.secondary_email = 'Required';
    }
    if (!values.secondary_phone) {
      errors.secondary_phone = 'Required';
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
    <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
      <CssBaseline />
      <Typography variant="h5" align="center" component="h2" gutterBottom> Update Profile </Typography>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={hotel}
        render={({ handleSubmit, reset, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Paper style={{ padding: 16 }}>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                  <Field
                    fullWidth
                    disabled
                    name="name"
                    inputProps={{ style: { textAlign: 'center' } }}
                    variant="filled"
                    component={TextField}
                    type="text"
                    label="Hotel Name"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="email"
                    fullWidth
                    required
                    disabled
                    variant="filled"
                    component={TextField}
                    type="email"
                    label="Primary Email"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="phone"
                    fullWidth
                    required
                    disabled
                    variant="filled"
                    component={TextField}
                    type="text"
                    label="Primary Phone"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="secondary_email"
                    fullWidth
                    placeholder={'Secondary email'}
                    variant="outlined"
                    component={TextField}
                    type="email"
                    label="Email"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="secondary_phone"
                    fullWidth
                    placeholder={'Secondary phone'}
                    variant="outlined"
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
                          name="address.address1"
                          fullWidth
                          required
                          disabled
                          variant="filled"
                          component={TextField}
                          type="text"
                          label="Address1"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="address.address2"
                          fullWidth
                          required
                          disabled
                          variant="filled"
                          component={TextField}
                          type="text"
                          label="Address2"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          fullWidth
                          name="address.state"
                          required
                          disabled
                          variant="filled"
                          component={TextField}
                          label="State"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          fullWidth
                          name="address.city"
                          required
                          disabled
                          variant="filled"
                          component={TextField}
                          label="City"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="address.pincode"
                          fullWidth
                          required
                          disabled
                          variant="filled"
                          component={TextField}
                          type="text"
                          label="Pin Code"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={6}>
                  <Field
                    fullWidth
                    required
                    variant="outlined"
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
                    variant="outlined"
                    name="frontDeskPhone"
                    component={TextField}
                    type="text"
                    label="Front desk number"
                  />
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </form>
        )}
      />
    </div>
  );
};

export default Profile;
