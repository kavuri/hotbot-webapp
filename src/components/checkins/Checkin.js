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
import IconButton from '@material-ui/core/IconButton';
import DirectionsWalkRoundedIcon from '@material-ui/icons/DirectionsWalkRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MuiPhoneNumber from 'material-ui-phone-number';

import { concat, remove } from 'lodash';

import { checkinGuest, checkoutGuest } from '../../utils/API';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export const CheckinGuest = (props) => {
  console.log('GuestCheckin:', props);
  const [room, setRoom] = useState(props.room);
  const [guestData, setGuestData] = useState(props.guestData);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setGuestData(props.guestData);
  }, [props.guestData]);

  const handleCheckin = async () => {
    if (!loading) {
      setLoading(true);
      var result = await checkinGuest(room, guestData);
      setLoading(false);
      if (result instanceof Error) {
        // FIXME: Do something
      } else {
        //   setDevice(result);
        setOpen(false);
        props.onGuestCheckin(result);
      }
    }
  }

  return (
    <div>
      <IconButton aria-label="delete" className={classes.margin} onClick={handleClickOpen} >
        <DirectionsWalkRoundedIcon fontSize="inherit" color="secondary" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Guest Checkin"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> Confirm check-in of {guestData.guestName}? </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary"> No </Button>
          <Button onClick={handleCheckin} color="primary" autoFocus> Yes </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export const CheckoutGuest = (props) => {
  console.log('GuestCheckout:', props);
  const [room, setRoom] = useState(props.room);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setRoom(props.room);
  }, [props.room]);

  const handleCheckout = async () => {
    if (!loading) {
      setLoading(true);
      let result = await checkoutGuest(room);
      setLoading(false);
      if (result instanceof Error) {
        // FIXME: Do something
      } else {
        setOpen(false);
        props.onGuestCheckout(result);
      }
    }
  }

  return (
    <div>
      <IconButton aria-label="delete" className={classes.margin} onClick={handleClickOpen} >
        <ExitToAppRoundedIcon fontSize="inherit" color="action" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Guest Checkout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> Confirm check-out of {room.checkincheckout.guestName}? </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary"> No </Button>
          <Button onClick={handleCheckout} color="primary" autoFocus> Yes </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default (props) => {
  const classes = useStyles();
  const [freeRooms, setFreeRooms] = useState(props.freeRooms);
  const [allotedRooms, setAllotedRooms] = useState(props.allotedRooms);
  const [guestData, setGuestData] = useState({ guestName: '', guestNumber: '' });

  useEffect(() => {
    setFreeRooms(props.freeRooms);
    setAllotedRooms(props.allotedRooms);
    console.log('--allotedRooms=', allotedRooms, ', freeRooms=',freeRooms);
  }, [props.freeRooms, props.allotedRooms]);

  const updateGuestName = (event) => {
    console.log('setting guest name=', event.target.value)
    // setGuestData({ guestName: event.target.value });
    guestData.guestName = event.target.value;
  }

  const updatePhoneNumber = (value) => {
    guestData.guestNumber = value;
  }

  const removeCheckinEntry = (checkin) => {
    let removed = remove(freeRooms, {room_no: checkin.room_no});
    removed[0].checkincheckout = checkin;
    let ar = concat(allotedRooms, removed);
    setAllotedRooms(ar);
  }

  const removeCheckoutEntry = (room) => {
    let removed = remove(allotedRooms, { room_no: room.room_no });
    removed[0].checkincheckout = null; // Since the room is not free to be alloted
    let fr = concat(freeRooms, removed);
    setFreeRooms(fr);
  }

  return (
    <div>
      <ExpansionPanel
        defaultExpanded
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Check-in</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableContainer >
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Room</TableCell>
                  <TableCell align="right">Guest Name</TableCell>
                  <TableCell align="right">Guest Phone</TableCell>
                  <TableCell align="right">Checkin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {freeRooms.map((row) => (
                  <TableRow key={row.room_no}>
                    <TableCell component="th" scope="row">
                      {row.room_no}
                    </TableCell>
                    <TableCell align="right"><form className={classes.root} autoComplete="off"><TextField required id="standard-basic" onChange={updateGuestName} label="Guest name" /></form></TableCell>
                    <TableCell align="right"><MuiPhoneNumber defaultCountry={'in'} onChange={updatePhoneNumber} /></TableCell>
                    <TableCell align="right"><CheckinGuest room={row} guestData={guestData} onGuestCheckin={removeCheckinEntry} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>


      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Check-Out</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableContainer >
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Room</TableCell>
                  <TableCell align="right">Guest Name</TableCell>
                  <TableCell align="right">Guest Phone</TableCell>
                  <TableCell align="right">Checked-in Date</TableCell>
                  <TableCell align="right">Checkout</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allotedRooms.map((row) => (
                  <TableRow key={row.room_no}>
                    <TableCell component="th" scope="row">
                      {row.room_no}
                    </TableCell>
                    <TableCell align="right">{row.checkincheckout.guestName}</TableCell>
                    <TableCell align="right">{row.checkincheckout.guestNumber}</TableCell>
                    <TableCell align="right">{new Date(row.checkincheckout.checkin).toDateString()}, {new Date(row.checkincheckout.checkin).toLocaleTimeString('en-US', {hour12:true})}</TableCell>
                    <TableCell align="right"><CheckoutGuest room={row} onGuestCheckout={removeCheckoutEntry} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}