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
import MUIDataTable from "mui-datatables";
import { useSnackbar } from 'notistack';

import { concat, remove } from 'lodash';

import { checkoutGuest, APICall } from '../../utils/API';
import { useRef } from 'react';

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

export const ConfirmationDialog = (props) => {
  const actionFun = useRef(props.actionFun);
  const message = useRef(props.message);
  const [open, setOpen] = useState(true);
  console.log('confirmationdialog:open=', open, '---', message, '---', actionFun, '+++', props)

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{message.current.header}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message.current.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary"> No </Button>
        <Button onClick={actionFun.current} color="primary" autoFocus> Yes </Button>
      </DialogActions>
    </Dialog>
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
  const [askForConfirmation, setAskForConfirmation] = useState(false);
  const [checkinDetails, setCheckinDetails] = useState({
    room: {},
    guestName: '',
    guestNumber: ''
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setFreeRooms(props.freeRooms);
    setAllotedRooms(props.allotedRooms);
    console.log('--allotedRooms=', allotedRooms, ', freeRooms=', freeRooms);
  }, [props.freeRooms, props.allotedRooms]);

  const updateGuestName = (event) => {
    console.log('setting guest name=', event.target.value)
    setCheckinDetails({ ...checkinDetails, guestName: event.target.value });
    // setGuestData({ guestName: event.target.value });
    // guestData.guestName = event.target.value;
  }

  const updatePhoneNumber = (value) => {
    setCheckinDetails({ ...checkinDetails, guestNumber: value });
    // guestData.guestNumber = value;
  }

  const removeCheckinEntry = (checkin) => {
    let removed = remove(freeRooms, { room_no: checkin.room_no });
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

  const handleCheckin = async () => {
    // if (!loading) {
    // setLoading(true);
    console.log('+++checking in guest:', checkinDetails);
    let body = {
      guestName: checkinDetails.guestName,
      guestNumber: checkinDetails.guestNumber
    };
    let result = null;
    try {
      result = await APICall('/room/' + checkinDetails.room.room_no + '/checkin', { method: 'POST', body: body, keyValues: { hotel_id: checkinDetails.room.hotel_id } });
      enqueueSnackbar('guest ' + body.guestName + ' checked in', { variant: 'success' });
      removeCheckinEntry(result);
    } catch (error) {
      enqueueSnackbar('Error checking in guest ' + body.guestName, { variant: 'error' });
    }
    setAskForConfirmation(false);
    // setLoading(false);
    // }
  }

  const openConfirmationDialog = (event, room) => {
    console.log('------opening confirmation dialog:', event.target.value, room);
    setCheckinDetails({ ...checkinDetails, room: room });
    setAskForConfirmation(true);
  }

  const freeRoomColumns = [
    {
      name: "_id",
      options: {
        display: false,
        filter: false
      }
    },
    {
      name: "room_no",
      label: "Room",
      options: {
        filter: true,
        sort: true,
        searchable: true
      }
    },
    {
      name: "type",
      label: "Type",
      options: {
        filter: true,
        sort: true,
        searchable: true,
      }
    },
    {
      name: "guestName",
      label: "Guest Name",
      options: {
        filter: false,
        sort: false,
        searchable: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <TextField required id="standard-basic" onChange={updateGuestName} label="Guest name" />
          );
        }
      }
    },
    {
      name: "guestNumber",
      label: "Guest Number",
      options: {
        filter: false,
        sort: false,
        searchable: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <MuiPhoneNumber defaultCountry={'in'} onChange={updatePhoneNumber} />
          );
        }
      }
    },
    {
      name: "checkin_btn",
      label: "Checkin",
      options: {
        filter: true,
        sort: true,
        searchable: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          console.log('^^^^value=', value, ',tableMeta=', tableMeta);
          return (
            <div>
              <IconButton aria-label="delete" className={classes.margin} onClick={e => openConfirmationDialog(e, freeRooms[tableMeta.rowIndex])} >
                <DirectionsWalkRoundedIcon fontSize="inherit" color="secondary" />
              </IconButton>
              {askForConfirmation && <ConfirmationDialog key={new Date()} room={freeRooms[tableMeta.rowIndex]} actionFun={handleCheckin} message={{ header: 'Check-in confirmation', description: 'Check-in guest ' + checkinDetails.guestName }} />}
            </div>
          );
        }
      }
    },
  ];

  const freeRoomOptions = {
    filter: true,
    selectableRows: false,
    filterType: 'checkbox',
    responsive: "scroll",
    rowsPerPage: 10,
    download: false,
    print: false,
    viewColumns: false,
    pagination: true,
    setTableProps: () => {
      return {
        padding: "default",
        size: "small"
      }
    }
  };

  return (
    <div>
      <ExpansionPanel defaultExpanded >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" >
          {/* <Typography className={classes.heading}>Check-in</Typography> */}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <MUIDataTable
              title={<Typography variant="body2"> Check-in Guests </Typography>}
              data={freeRooms}
              columns={freeRoomColumns}
              options={freeRoomOptions}
            /></div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      {/* 
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
                    <TableCell align="right">{new Date(row.checkincheckout.checkin).toDateString()}, {new Date(row.checkincheckout.checkin).toLocaleTimeString('en-US', { hour12: true })}</TableCell>
                    <TableCell align="right"><CheckoutGuest room={row} onGuestCheckout={removeCheckoutEntry} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel> */}

    </div>
  );
}