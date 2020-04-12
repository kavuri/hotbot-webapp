/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DirectionsWalkRoundedIcon from '@material-ui/icons/DirectionsWalkRounded';
import HistoryRoundedIcon from '@material-ui/icons/HistoryRounded';
import { isEqual, isEmpty, isNull, isUndefined } from 'lodash';

import Selector from '../Selector';
import { APICall, getHotelRooms } from '../../utils/API';
import Checkin from './Checkin';
import { KamAppContext } from '../KamAppContext';

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
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [checkedIn, setCheckedIn] = useState([]);
  const [notCheckedIn, setNotCheckedIn] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const ctx = useContext(KamAppContext);

  useEffect(() => {
    getRooms();
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getRooms = async () => {
    if (!loading) {
      setLoading(true);
      let results = await getHotelRooms(ctx.hotel);
      if (results instanceof Error) {
        console.error('error in getHotelRooms:', results);
        //FIXME: Do something
      } else {
        let check_ins = [], non_check_ins = [];
        for (var i = 0; i < results.length; i++) {
          if (isNull(results[i].checkincheckout) || isUndefined(results[i].checkincheckout)) {
            non_check_ins.push(results[i]);
          } else {
            check_ins.push(results[i]);
          }
        }
        console.log('all rooms=', results, ',check_ins=', check_ins, ', non_checkins=', non_check_ins);
        setCheckedIn(check_ins);
        setNotCheckedIn(non_check_ins);
        setRooms(results);
      }
      setLoading(false);
    }
  }

  return (
    <div>
      <Paper square className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="icon label tabs example"
        >
          <Tab icon={<DirectionsWalkRoundedIcon fontSize="large" color="secondary" />} label="CHECKIN-CHECKOUT" />
          <Tab icon={<HistoryRoundedIcon fontSize="large" color="primary" />} label="HISTORY" />
        </Tabs>
        {isEqual(value, 0) && <Checkin freeRooms={notCheckedIn} allotedRooms={checkedIn} />}
        {/* {isEqual(value, 1) && <Checkout allotedRooms={checkedIn} />} */}
      </Paper>
    </div>
  );
}
