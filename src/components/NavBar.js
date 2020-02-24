/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../react-auth0-spa";
// NEW - import the Link component
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (

    <div>
      {!isAuthenticated && (<button onClick={() => loginWithRedirect({})}>Log in</button>)}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}

      {/* NEW - add a link to the home and profile pages */}
      {isAuthenticated && (
        <span>
          <Link to="/">Home</Link>&nbsp;
        <Link to="/profile">Profile</Link>
          <Link to="/devices">Get Devices</Link>
          <Link to="/orders">Listen for Orders</Link>
          <Link to="/testorders">EventSource Test</Link>
        </span>
      )}

    </div>
  );
};

export default NavBar;
