/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AssignmentTurnedInRoundedIcon from '@material-ui/icons/AssignmentTurnedInRounded';

import { remove } from 'lodash';

import Selector from './Selector';
import { API_SERVER_URL } from '../Config';

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

  useEffect(() => {
    loadUnassignedDevices();
    loadHotels();
  }, []);

  const loadUnassignedDevices = () => {
    if (!loading) {
      setLoading(true);
      // fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token } })
      fetch(API_SERVER_URL + '/device/unassigned', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((results) => {
          console.log('unassigned devices=', results);
          let allItems = results.map((d) => { return { name: d.address.addressLine1 + '; ' + d.address.addressLine2, id: d.device_id } });
          // let allItems = results.map((d) => { return { name: d.address.addressLine1 + '; ' + d.address.addressLine2, id: d.device_id, _id: d._id } });
          setUnassignedDevices(allItems);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }

  const loadHotels = () => {
    if (!loading) {
      setLoading(true);
      // fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token } })
      fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((results) => {
          console.log('hotels=', results);
          let allHotels = results.map((h) => { return { name: h.name, id: h.hotel_id, _id: h._id } });
          setHotels(allHotels);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }

  const getRooms = (hotel) => {
    console.log('getting rooms...', hotel);
    if (!loading) {
      setLoading(true);
      // fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token } })
      fetch(API_SERVER_URL + '/hotel/' + hotel.id, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((results) => {
          console.log('rooms=', results);
          let allRooms = results.rooms.map((r) => { return { name: r.room_no + ', ' + r.type, id: r.room_no, _id: r._id } })
          setRooms(allRooms);
          setHotel(hotel);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }

  const fixDevice = (device) => {
    setDevice(device);
  }

  const fixRoom = (room) => {
    setRoom(room);
  }

  const handleAssign = () => {
    console.log('device=', device, ',hotel=', hotel, ',room=', room);
    if (!loading) {
      setLoading(true);
      // fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token } })
      fetch(API_SERVER_URL + '/device/' + device.id + '/register?hotel_id=' + hotel.id + '&room_no=' + room.id, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((results) => {
          console.log('device assigned=', results);
          setUnassignedDevices(remove(unassignedDevices, { id: device.id }));
          setHotels(remove(hotels, { id: hotel.id }));
          setRooms(remove(rooms, { id: room.id }));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }

  return (
    <Grid container className={classes.root} spacing={2} >
      <Grid container className={classes.root} spacing={3} direction="row" justify="center" alignItems="center" >
        <Grid item xs>
          <Selector menuName="Devices" items={unassignedDevices} onSelectEntry={fixDevice} />
        </Grid>
        <Grid item xs>
          <Selector menuName="Hotels" items={hotels} onSelectEntry={getRooms} />
        </Grid>
        <Grid item xs>
          <Selector menuName="Rooms" items={rooms} onSelectEntry={fixRoom} />
        </Grid>
      </Grid>
      <Grid item xs={12}  >
        <IconButton aria-label="assign" className={classes.margin} onClick={handleAssign} >
          <AssignmentTurnedInRoundedIcon fontSize="large" /> Assign Device
        </IconButton>
      </Grid>
    </Grid>
  );
}