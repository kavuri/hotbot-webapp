/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';

import { useSnackbar } from 'notistack';
import { remove, isEmpty } from 'lodash';

import { useKamAppCtx } from '../KamAppContext';
import Selector from '../Selector';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export default (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [unassignedDevices, setUnassignedDevices] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [device, setDevice] = useState({});
  const [hotel, setHotel] = useState({});
  const [room, setRoom] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const { APICall } = useKamAppCtx();
  useEffect(() => {
    loadUnassignedDevices();
    loadHotels();
  }, []);

  const loadUnassignedDevices = async () => {
    if (!loading) {
      setLoading(true);
      let results = null;
      try {
        results = await APICall('/device/unassigned', { method: 'GET' });
        let res = results.map((d) => { return { name: d.address.addressLine1 + '; ' + d.address.addressLine2, id: d.device_id } });
        setUnassignedDevices(res);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar('Error fetching devices data', { variant: 'error' });
      }
    }
  }

  const loadHotels = async () => {
    if (!loading) {
      setLoading(true);
      let results = undefined, res;
      try {
        results = await APICall('/hotel', { method: 'GET' });
        setLoading(false);
        res = results.data.map((h) => { return { name: h.name, id: h.hotel_id, _id: h._id } });
        setHotels(res);
      } catch (error) {
        enqueueSnackbar('Error fetching hotels', { variant: 'error' });
      }
    }
  }

  const getRooms = async (hotel) => {
    if (!loading && !isEmpty(hotel)) {
      setLoading(true);
      let results = null;
      try {
        results = await APICall('/hotel/' + hotel.id, { method: 'GET' });
        let allRooms = results.map((r) => { return { name: r.room_no + ', ' + r.type, id: r.room_no, _id: r._id } })
        setRooms(allRooms);
        setHotel(hotel);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar('Error fetching devices data', { variant: 'error' });
      }
    }
  }

  const handleAssign = async () => {
    console.log('device=', device, ',hotel=', hotel, ',room=', room);
    if (!loading) {
      setLoading(true);
      let results = await APICall('/device/' + device.id + '/register', { method: 'POST', keyValues: { hotel_id: hotel.id, room_no: room.id } });

      remove(unassignedDevices, { id: device.id });
      remove(hotels, { id: hotel.id });
      remove(rooms, { id: room.id });
      props.deviceRegistered(device);
      setLoading(false);
    }
  }

  return (
    <Grid container className={classes.root} spacing={2} >
      <Grid container className={classes.root} spacing={3} direction="row" justify="center" alignItems="center" >
        <Grid item xs>
          <Selector menuName="Devices" items={unassignedDevices} onSelectEntry={(device) => setDevice(device)} />
        </Grid>
        <Grid item xs>
          <Selector menuName="Hotels" items={hotels} onSelectEntry={getRooms} />
        </Grid>
        <Grid item xs>
          <Selector menuName="Rooms" items={rooms} onSelectEntry={(room) => setRoom(room)} />
        </Grid>
      </Grid>
      <Grid item xs={12}  >
        <IconButton aria-label="assign" className={classes.margin} onClick={handleAssign} >
          <AddCircleRoundedIcon fontSize="large" /> Assign Device
        </IconButton>
      </Grid>
    </Grid>
  );
}