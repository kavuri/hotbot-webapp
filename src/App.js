/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React from "react";
import NavBar from "./components/NavBar";
import './App.css'

// New - import the React Router components, and the Profile page component
import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";
import ExternalApi from "./views/ExternalApi";
import Orders from "./views/Orders";
import TestOrders from "./views/TestOrders";

import Dashboard from './components/Dashoard';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://kamamishu.com/">
        Kamamishu
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function App() {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        </Typography>
      <Dashboard />
    </div>
  );
}

export default App;
