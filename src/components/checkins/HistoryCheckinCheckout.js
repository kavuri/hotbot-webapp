/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MUIDataTable from "mui-datatables";
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { concat, remove, isEqual } from 'lodash';

import { APICall } from '../../utils/API';
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
  const [checkincheckouts, setCheckincheckouts] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    allCheckinCheckouts();
  }, []);

  const allCheckinCheckouts = async () => {
    let result = null;
    try {
      result = await APICall('/room/checkincheckouts', { method: 'GET', keyValues: { hotel_id: "1" } });
      setCheckincheckouts(result);
    } catch (error) {
      enqueueSnackbar('Error fetching data ', { variant: 'error' });
    }
  }

  const columns = [
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
      name: "guestName",
      label: "Guest Name",
      options: {
        filter: false,
        sort: false,
        searchable: true,
      }
    },
    {
      name: "guestNumber",
      label: "Guest Number",
      options: {
        filter: false,
        sort: false,
        searchable: true,
      }
    },
    {
      name: "checkin",
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
      label: "Checkout Time",
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
    <MUIDataTable
      title={<Typography variant="body2"> Check-out Guests </Typography>}
      data={checkincheckouts}
      columns={columns}
      options={options}
    />
  );
}