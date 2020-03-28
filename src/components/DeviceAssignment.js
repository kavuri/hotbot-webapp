/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DeviceUnknownRoundedIcon from '@material-ui/icons/DeviceUnknownRounded';
import PhonelinkSetupRoundedIcon from '@material-ui/icons/PhonelinkSetupRounded';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 1200,
  },
});

export default () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * All active devices and also that can be de-activated and unassigned
   */
  const activeDevices = () => {

  }

  const assignDevice = (hotel_id, device_id, room_no) => {

  }

  return (
    <Paper square className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="icon label tabs example"
      >
        <Tab icon={<PhonelinkSetupRoundedIcon fontSize="large" color="secondary" />} label="ACTIVE" />
        <Tab icon={<DeviceUnknownRoundedIcon fontSize="large" color="error" />} label="UNASSIGNED" />
      </Tabs>
    </Paper>
  );
}