/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ShoppingCartRoundedIcon from '@material-ui/icons/ShoppingCartRounded';
import HistoryRoundedIcon from '@material-ui/icons/HistoryRounded';
import { cyan, green, pink, orange } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';
import { isEqual } from 'lodash';

import LiveOrders from './LiveOrders';
import History from './History';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    minWidth: 650,
  },
}));

export const renderRow = (value, type) => {
    switch (type) {
        case 'menu':
            return <Chip size='medium' label={value} style={{ background: green[200] }} />
            break;
        case 'roomitem':
            return <Chip size='medium' label={value} style={{ background: cyan[200] }} />
            break;
        case 'facility':
            return <Chip size='medium' label={value} style={{ background: orange[200] }} />
            break;
        case 'problem':
            return <Chip size='medium' label={value} style={{ background: pink[200] }} />
            break;
        default:
            break;
    }
}

export default () => {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          <Tab icon={<ShoppingCartRoundedIcon fontSize="large" color="secondary" />} label="LIVE ORDERS" />
          <Tab icon={<HistoryRoundedIcon fontSize="large" color="primary" />} label="ORDER HISTORY" />
        </Tabs>
        {isEqual(value, 0) && <LiveOrders />}
        {isEqual(value, 1) && <History />}
      </Paper>
    </div>
  );
}
