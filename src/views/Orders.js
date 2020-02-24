/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
// src/views/ExternalApi.js

import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa";
import '../App.css'

const ExternalApi = () => {
  const [nests, setNests] = useState([]);
  const [listening, setListening] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { user, getTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
console.log('token=',token, user)

      if (!listening) {
         const events = new EventSource("http://localhost:3000/api/v1/order/listen?token="+token);

         var responseData;
         events.onmessage = (event) => {
            console.log('got data=', event);
            responseData = JSON.parse(event.data);
            //setNests((nests) => nests.concat(responseData));
         }
         setListening(true);
      }
      //setListening(true);

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
console.log('error=',error);
      console.error(error);
    }
  };

  return (
    <>
      <h1>External API</h1>
      <button onClick={callApi}>Listen for Orders</button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
    </>
  );
};

export default ExternalApi;
