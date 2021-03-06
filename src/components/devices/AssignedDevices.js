/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

import { isNull, isUndefined, remove, isEqual } from 'lodash';

import { useSnackbar } from 'notistack';
import { useKamAppCtx } from '../KamAppContext';
import Selector from '../Selector';

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
  const [state, setState] = useState(isNull(props.device.status) ? 'inactive' : 'active');
  const [device, setDevice] = useState(props.device);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [statesData, setStatesData] = useState({
    active: { name: 'Active', dialogMsg: 'Confirm de-activation of device? Your hotel guests will not be able to use Kamamishu service' },
    inactive: { name: 'Inactive', dialogMsg: 'Confirm activation of device? Kamamishu will be live for use' }
  });

  const { enqueueSnackbar } = useSnackbar();
  const { APICall } = useKamAppCtx();

  const handleChange = (event) => {
    // setState({ ...state, [event.target.name]: event.target.checked });
    setOpen(true);
    console.log('handleChange=', state, event.target.name, event.target.checked)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeStatus = async () => {
    let results = null;
    try {
      let URL_PATH = '';
      if (isEqual(state, 'active')) {
        // Deactivate the device
        URL_PATH = '/device/' + device.device_id + '/deactivate';
      } else if (isEqual(state, 'inactive')) {
        // activate the device
        URL_PATH = '/device/' + device.device_id + '/activate';
      }
      results = await APICall(URL_PATH, { method: 'POST', keyValues: { hotel_id: device.hotel_id } });
      setDevice(results);
      setState(results.status);
      setOpen(false);
      props.onDeviceStateChange(results);
      enqueueSnackbar('Device activated', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error changing device status', { variant: 'error' });
    }
  }

  return (
    <div>
      <FormControlLabel control={<Switch checked={state === 'active'} onChange={handleChange} name='active' />} label={statesData[state].name} />
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

  const { APICall } = useKamAppCtx();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setDevice(props.device);
  }, [props.device]);

  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeregister = async () => {
    console.log('###deegister device=', device);
    let results = null;
    try {
      results = await APICall('/device/' + device.device_id + '/deregister', { method: 'POST', keyValues: { hotel_id: device.hotel_id, room_no: device.room_no } });
      setDevice(results);
      setOpen(false);
      props.onDeviceDeregister(results);
      enqueueSnackbar('Device de-registared', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error device deregistration', { variant: 'error' });
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
  const [hotels, setHotels] = useState([]);

  const { APICall } = useKamAppCtx();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    loadHotels();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateAssignedDevices = (device) => {
    console.log('should remove:', device);
    remove(assignedDevices, { room_no: device.room_no });
    props.deviceDeregistered(device);
  }

  const changeDeviceState = (device) => {
    console.log('device state change:', device);
  }

  const loadHotels = async () => {
    if (!loading) {
      setLoading(true);
      let results = null, res;
      try {
        results = await APICall('/hotel', { method: 'GET' });
        setLoading(false);
        res = results.data.map((h) => { return { name: h.name, id: h.hotel_id, _id: h._id } });
        setHotels(res);
      } catch (error) {
        enqueueSnackbar('Error loading hotels. Try again', { variant: 'error' });
      }
    }
  }

  const getDevices = async (hotel) => {
    console.log('getting devices for ', hotel.id);
    if (!loading && !isUndefined(hotel)) {
      setLoading(true);
      let results = null;
      try {
        results = await APICall('/device', { method: 'GET', keyValues: { hotel_id: hotel.id } });
        setLoading(false);

        let assigned = [];
        for (var i = 0; i < results.length; i++) {
          if (isNull(results[i].room) || isUndefined(results[i].room) || isNull(results[i].belongs_to) || isUndefined(results[i].belongs_to)) {
          } else {
            assigned.push(results[i]);
            console.log('pushing to assined...', assigned)
          }
        }
        setAssignedDevices(assigned);
      } catch (error) {
        enqueueSnackbar('Error getting devices. Try again', { variant: 'error' });
      }
    }
  }

  return (
    <div>
      <Selector menuName="Hotels" items={hotels} onSelectEntry={getDevices} />
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
    </div>
  );
}