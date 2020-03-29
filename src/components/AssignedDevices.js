/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { remove, isEqual } from 'lodash';

import { API_SERVER_URL } from '../Config';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export const DeviceStateChange = (props) => {
  const [state, setState] = useState(props.device.status);
  const [device, setDevice] = useState(props.device);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    // setState({ ...state, [event.target.name]: event.target.checked });
    setOpen(true);
    console.log('handleChange=',state, event.target.name, event.target.checked)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeStatus = () => {
    console.log('###change status=', state);
    let URL;
    if (isEqual(state, 'active')) {
      // Deactivate the device
      URL = API_SERVER_URL + '/device/' + device.device_id + '/deactivate?hotel_id=' + device.hotel_id;
    } else if (isEqual(state, 'inactive')) {
      // activate the device
      URL = API_SERVER_URL + '/device/' + device.device_id + '/activate?hotel_id=' + device.hotel_id;
    }

    if (!loading) {
      setLoading(true);
      // fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token } })
      fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((result) => {
          console.log('devices=', result);
          setDevice(result);
          setLoading(false);
          setState(result.status);
          setOpen(false);
          props.onDeviceDeregister(result);
        })
        .catch(() => setLoading(false));
    }
  }

  let statesData =
  {
    active: { name: 'Active', dialogMsg: 'Confirm de-activation of device?' },
    inactive: { name: 'Inactive', dialogMsg: 'Confirm activation of device?' }
  };

  console.log('statesData=',statesData[state]);

  return (
    <div>
      <FormControlLabel control={<Switch checked={state === 'active'} onChange={handleChange} name="active" />} label={statesData[state].name} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Change Device Status"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> {statesData[state].dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary"> No </Button>
          <Button onClick={changeStatus} color="primary" autoFocus> Yes </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export const DeregisterDevice = (props) => {
  const [device, setDevice] = useState(props.device);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeregister = () => {
    console.log('###deegister device=', device);
    if (!loading) {
      setLoading(true);
      // fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token } })
      fetch(API_SERVER_URL + '/device/' + device.device_id + '/deregister?hotel_id=' + device.hotel_id + '&room_no=' + device.room_no, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((result) => {
          console.log('devices=', result);
          setDevice(result);
          setLoading(false);
          setOpen(false);
          props.onDeviceDeregister(result);
        })
        .catch(() => setLoading(false));
    }
  }

  return (
    <div>
      <IconButton aria-label="delete" className={classes.margin} onClick={handleClickOpen} >
        <DeleteRoundedIcon fontSize="inherit" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Deregister Device?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> Do you want to remove this device from this hotel? </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary"> No </Button>
          <Button onClick={handleDeregister} color="primary" autoFocus> Yes </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [assignedDevices, setAssignedDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAssignedDevices(props.assignedDevices);
  }, [props.assignedDevices])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateAssignedDevices = (device) => {
    console.log('should remove:', device);
    remove(assignedDevices, { room_no: device.room_no });
  }

  const changeDeviceState = (device) => {
    console.log('device state change:', device);
  }

  return (
    <TableContainer >
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Room</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Deregister Device</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignedDevices.map((row) => (
            <TableRow key={row.room_no}>
              <TableCell component="th" scope="row">
                {row.room_no}
              </TableCell>
              <TableCell align="right"><DeviceStateChange device={row} onDeviceStateChange={changeDeviceState} /></TableCell>
              <TableCell align="right"><DeregisterDevice device={row} onDeviceDeregister={updateAssignedDevices} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}