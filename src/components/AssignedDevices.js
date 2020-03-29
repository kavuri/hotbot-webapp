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

import { remove } from 'lodash';

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

/*
const IOSSwitch = withStyles(theme => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});
*/

export const DeregisterDevice = (props) => {
  const [device, setDevice] = useState(props.device);
  console.log(device);
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

  const deactivateDevice = (deviceId) => {

  }

  const activateDevice = (deviceId) => {

  }

  const updateAssignedDevices = (device) => {
    console.log('should remove:', device);
    remove(assignedDevices, { room_no: device.room_no });
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
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="right"><DeregisterDevice device={row} onDeviceDeregister={updateAssignedDevices} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}