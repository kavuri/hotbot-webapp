/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MaterialTable from 'material-table';
const fetch = require('node-fetch');
import Title from './Title';
import { API_SERVER_URL } from '../../Config';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, name, description, Address, Hotels, Contact };
}

const rows = [
  createData(0, 'Ginger Hotels', 'Head quarters of Ginger', { address1: 'ITPL', 'address2': 'Opp SAP', 'city': 'Bengaluru', 'state': 'KA', 'pin': '560037' }, { 'phone': ['080-232232', '9499292929'], 'email': 'contact@gingerhotels.com' }),
  createData(1, 'Keys Hotels', 'Head quarters of Keys', { address1: 'ITPL', 'address2': 'Opp SAP', 'city': 'Bengaluru', 'state': 'KA', 'pin': '560037' }, { 'phone': ['080-232232', '9499292929'], 'email': 'contact@keyshotels.com' }),
  createData(2, 'Lemon Hotels', 'Head quarters of Lemon', { address1: 'ITPL', 'address2': 'Opp SAP', 'city': 'Bengaluru', 'state': 'KA', 'pin': '560037' }, { 'phone': ['080-232232', '9499292929'], 'email': 'contact@lemonhotels.com' }),
  createData(3, 'Ramada Hotels', 'Head quarters of Ramada', { address1: 'ITPL', 'address2': 'Opp SAP', 'city': 'Bengaluru', 'state': 'KA', 'pin': '560037' }, { 'phone': ['080-232232', '9499292929'], 'email': 'contact@ramadahotels.com' }),
  createData(4, 'Taj Hotels', 'Head quarters of Taj', { address1: 'ITPL', 'address2': 'Opp SAP', 'city': 'Bengaluru', 'state': 'KA', 'pin': '560037' }, { 'phone': ['080-232232', '9499292929'], 'email': 'contact@tajhotels.com' })
];
class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      groups: []
    };
  }

  componentDidMount() {
    // Fetch the groups
    const token = window.$token;
    fetch(API_SERVER_URL + '/hotelGroup', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + token.access_token
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            groups: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error
          })
        }
      )
  }
}
function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Hotel Groups</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}
