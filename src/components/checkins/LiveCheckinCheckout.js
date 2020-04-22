/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import moment from 'moment';
import { concat, remove, isEmpty } from 'lodash';

import { useKamAppCtx } from '../KamAppContext';

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

export default (props) => {
  const classes = useStyles();
  const [freeRooms, setFreeRooms] = useState([]);
  const [allotedRooms, setAllotedRooms] = useState([]);
  const [askForConfirmation, setAskForConfirmation] = useState(false);
  const [checkinDetails, setCheckinDetails] = useState({
    room: {},
    guestName: '',
    guestNumber: ''
  });

  const { APICall } = useKamAppCtx();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setFreeRooms(props.freeRooms);
    setAllotedRooms(props.allotedRooms);
    console.log('--allotedRooms=', allotedRooms, ', freeRooms=', freeRooms);
  }, [props.freeRooms, props.allotedRooms]);

  const updateGuestName = (event) => {
    console.log('setting guest name=', event.target.value)
    setCheckinDetails({ ...checkinDetails, guestName: event.target.value });
  }

  const updatePhoneNumber = (value) => {
    setCheckinDetails({ ...checkinDetails, guestNumber: value });
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

  const handleCheckin = async (e, room) => {
    let body = {
      guestName: checkinDetails.guestName,
      guestNumber: checkinDetails.guestNumber
    };
    let result = null;
    try {
      result = await APICall('/room/' + room.room_no + '/checkin', { method: 'POST', body: body, keyValues: { hotel_id: room.hotel_id } });
      enqueueSnackbar('guest ' + body.guestName + ' checked in', { variant: 'success' });
      removeCheckinEntry(result);
    } catch (error) {
      enqueueSnackbar('Error checking in guest ' + body.guestName, { variant: 'error' });
    }
    setAskForConfirmation(false);
  }

  const handleCheckout = async (e, room) => {
    let result = null;
    try {
      result = await APICall('/room/' + room.room_no + '/checkout', { method: 'POST', keyValues: { hotel_id: room.hotel_id } });
      enqueueSnackbar('guest ' + room.checkincheckout.guestName + ' checked out from room ' + room.room_no, { variant: 'success' });
      removeCheckoutEntry(result);
    } catch (error) {
      enqueueSnackbar('Error checking out guest ' + room.checkincheckout.guestName, { variant: 'error' });
    }
    setAskForConfirmation(false);
  }

  const ConfirmationDialog = (props) => {
    const actionFun = useRef(props.actionFun);
    const message = useRef(props.message);
    const dialogType = useRef(props.dialogType);
    const [open, setOpen] = useState(false);

    const handleClose = () => {
      setOpen(false);
    }

    return (
      <div>
        {(dialogType.current === 'checkin') &&
          <IconButton aria-label="delete" className={classes.margin} onClick={() => setOpen(true)} >
            <DirectionsWalkRoundedIcon fontSize="inherit" color="secondary" />
          </IconButton>}
        {(dialogType.current === 'checkout') &&
          <IconButton aria-label="checkout" className={classes.margin} onClick={() => setOpen(true)} >
            <ExitToAppRoundedIcon fontSize="inherit" color="secondary" />
          </IconButton>}
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
      </div>
    )
  };

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
          return (
            <ConfirmationDialog
              dialogType='checkout'
              actionFun={(e) => handleCheckin(e, freeRooms[tableMeta.rowIndex])}
              message={{ header: 'Check-in confirmation', description: 'Check-in guest "' + checkinDetails.guestName + '" to room "' + freeRooms[tableMeta.rowIndex].room_no + '"?' }}
            />
          );
        }
      }
    },
  ];

  const allotedRoomColumns = [
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
      name: "checkincheckout.guestName",
      label: "Guest Name",
      options: {
        filter: false,
        sort: false,
        searchable: true,
      }
    },
    {
      name: "checkincheckout.guestNumber",
      label: "Guest Number",
      options: {
        filter: false,
        sort: false,
        searchable: true,
      }
    },
    {
      name: "checkincheckout.checkin",
      label: "Checkin Time",
      options: {
        filter: false,
        sort: true,
        searchable: false,
        customBodyRender: (value, tablbeMeta, updateValue) => {
          return (
            <span>{moment(value).format('MMMM Do YYYY, h:mm a')}</span>
          )
        }
      }
    },
    {
      name: "checkout",
      label: "Check Out",
      options: {
        filter: true,
        sort: true,
        searchable: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <ConfirmationDialog
              dialogType='checkout'
              actionFun={(e) => handleCheckout(e, allotedRooms[tableMeta.rowIndex])}
              message={{ header: 'Check-out confirmation', description: 'Check-out guest "' + allotedRooms[tableMeta.rowIndex].checkincheckout.guestName + '" from room "' + allotedRooms[tableMeta.rowIndex].room_no + '"?' }}
            />
          );
        }
      }
    },
  ];

  const options = {
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
          <MUIDataTable
            title={<Typography variant="body2"> Check-in Guests </Typography>}
            data={freeRooms}
            columns={freeRoomColumns}
            options={options}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel defaultExpanded >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" >
          {/* <Typography className={classes.heading}>Check-in</Typography> */}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <MUIDataTable
            title={<Typography variant="body2"> Check-out Guests </Typography>}
            data={allotedRooms}
            columns={allotedRoomColumns}
            options={options}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}