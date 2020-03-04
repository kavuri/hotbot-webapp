/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { isNull, isUndefined, isEqual } from 'lodash';

import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import Hotels from './admin/Hotels';
import Groups from './admin/Groups';
import ProfileMenu from './ProfileMenu';
import AdminMenu from './admin/AdminMenu';
import ConsumerMenu from './ConsumerMenu';
import Default from './Default';

import { useAuth0 } from "../react-auth0-spa";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a href="https://www.kamamishu.com">Kamamishu   </a>
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  const { user } = useAuth0();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [role, setRole] = React.useState(null);
  const [ComponentToRender, setComponentToRender] = React.useState(Default);
  
  const menuComponentMap = {
    'default': Default,
    'groups': Groups,
    'hotels': Hotels,
    'addHotelGroup': 'AddHotelGroup',
    'addHotel': 'AddHotel',
    'settings': 'Settings',
    'orders': Orders,
    'profile': 'Profile'
  };
  const checkUserRole = () => {
    console.log('checking user role...')
    if (isNull(user) || isUndefined(user)) {
      return;
    }
    console.log('user is not null', role)
    if ((isNull(role) || isUndefined(role)) && !isUndefined(user)) {
      setRole(user.app_metadata.role);
    }
  }
  checkUserRole();  // Checks the user role on page open

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const menuOptionSelected = (option) => {
    const ComponentToRender = menuComponentMap[option];
    setComponentToRender(<ComponentToRender />);
    console.log('option selected=', option, ComponentToRender);
  }

  const renderRBAMenu = (role) => {
    // role = 'admin'
    if (role === 'admin') {
      // Set the intial screen as hotels

      return <AdminMenu optionSelected={menuOptionSelected} />
    } else if (role === 'consumer') {
      return <ConsumerMenu optionSelected={menuOptionSelected} />
    } else if (isUndefined(role)) {
      return null;
    }
  }

  const renderSideMenu = () => {
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {renderRBAMenu(role)}
        </List>
        <Divider />
        <List><ProfileMenu optionSelected={menuOptionSelected} /></List>
      </Drawer>
    )
  }

  const renderHeading = () => {
    return (
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
        </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }

  const renderContent = () => {
    return (
      <Grid container spacing={3}>
        {/* Chart */}
        {/* <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid> */}
        {/* Recent Deposits */}
        {/* <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Deposits />
          </Paper>
        </Grid> */}
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {/* <Orders /> */}
            {ComponentToRender}
            {/* <Groups /> */}
          </Paper>
        </Grid>
      </Grid>
    )
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      {renderHeading()}
      {renderSideMenu()}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {renderContent('')}
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
