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
import { isEqual } from 'lodash';

import AssignedDevices from './AssignedDevices';
import UnassignedDevices from './UnassignedDevices';
import Selector from './Selector';

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
  const [hotels, setHotels] = useState([]);
  const [unassignedDevices, setUnassignedDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {/* <Selector menuName="Hotels" items={hotels} onSelectEntry={getDevices} /> */}
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
        {isEqual(value, 0) && <AssignedDevices assignedDevices={assignedDevices} />}
        {isEqual(value, 1) && <UnassignedDevices unassignedDevices={unassignedDevices} />}
      </Paper>
    </div>
  );
}
