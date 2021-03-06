/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DirectionsWalkRoundedIcon from '@material-ui/icons/DirectionsWalkRounded';
import HistoryRoundedIcon from '@material-ui/icons/HistoryRounded';
import { isEqual, isEmpty, isNull } from 'lodash';

import LiveCheckinCheckout from './LiveCheckinCheckout';
import { useKamAppCtx } from '../KamAppContext';
import HistoryCheckinCheckout from './HistoryCheckinCheckout';

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
  const [rooms, setRooms] = useState([]);
  const [freeRooms, setFreeRooms] = useState([]);
  const [allotedRooms, setAllotedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { APICall } = useKamAppCtx();

  useEffect(() => {
    getRooms();
  }, [rooms]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getRooms = async () => {
    if (!loading) {
      setLoading(true);
      let results = [];
      try {
        results = await APICall('/room', { method: 'GET' });
      } catch (error) {
        console.log('error in getting hotel rooms:', error);
      }

      console.log('All Rooms=', results);
      let frs = [], alrs = [];
      frs = results.filter((r) => { return isNull(r.checkincheckout) });
      alrs = results.filter((r) => { return !isNull(r.checkincheckout) });
      console.log('^^^frs=', frs, '---alrs=', alrs);
      setFreeRooms(frs);
      setAllotedRooms(alrs);
      setRooms(results);
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
        {isEqual(value, 0) && <LiveCheckinCheckout freeRooms={freeRooms} allotedRooms={allotedRooms} />}
        {isEqual(value, 1) && <HistoryCheckinCheckout />}
      </Paper>
    </div>
  );
}
