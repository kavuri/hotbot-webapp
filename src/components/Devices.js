/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DeviceUnknownRoundedIcon from '@material-ui/icons/DeviceUnknownRounded';
import PhonelinkSetupRoundedIcon from '@material-ui/icons/PhonelinkSetupRounded';
import { isNull, isUndefined, isEqual } from 'lodash';

import AssignedDevices from './AssignedDevices';
import HotelSelector from './HotelSelector';
import { API_SERVER_URL } from '../Config';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    minWidth: 650,
  },
}));

export default () => {
  const [value, setValue] = useState(0);
  const [assignedDevices, setAssignedDevices] = useState([]);
  const [unassignedDevices, setUnassignedDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getDevices = (_id) => {
    if (!loading) {
      setLoading(true);
      // fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token } })
      fetch(API_SERVER_URL + '/device?hotel_id=' + _id, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((results) => {
          console.log('devices=', results);
          let assigned = [], unassigned = [];
          for (var i = 0; i < results.length; i++) {
            if (isNull(results[i].room) || isUndefined(results[i].room) || isNull(results[i].belongs_to) || isUndefined(results[i].belongs_to)) {
              unassigned.push(results[i]);
            } else {
              assigned.push(results[i]);
            }
          }
          setAssignedDevices(assigned);
          setUnassignedDevices(unassigned);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }

  return (
    <div>
      <HotelSelector onSelectHotel={getDevices} />
      <Paper square className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="icon label tabs example"
        >
          <Tab icon={<PhonelinkSetupRoundedIcon fontSize="large" color="secondary" />} label="ASSIGNED" />
          <Tab icon={<DeviceUnknownRoundedIcon fontSize="large" color="error" />} label="UNASSIGNED" />
        </Tabs>
        <AssignedDevices assignedDevices={assignedDevices} />
      </Paper>
    </div>
  );
}
