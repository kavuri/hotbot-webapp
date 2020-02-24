import React, { useState, useEffect } from 'react';
import '../App.css';
import { useAuth0 } from "../react-auth0-spa";

function TestOrders() {
  const [ nests, setNests ] = useState([]);
  const [ token, setToken ] = useState({});
  const [ listening, setListening ] = useState(false);
  const { user, getTokenSilently } = useAuth0();

  useEffect( () => {
    if (!listening) {
      const authToken = async () => {
         const token = await getTokenSilently();
         console.log('xxx=',token);
         setToken(token);
         return token;
      }
      
      var p = getTokenSilently();
      p.then(function(t) {
         console.log(t);

         const events = new EventSource('http://localhost:3000/api/v1/order/listen?token='+t);
         //const events = new EventSource('http://localhost:3000/api/v1/order/testlisten?token='+t);
         events.onmessage = (event) => {
           console.log('received event:',event);
           const parsedData = JSON.parse(event.data);

           setNests((nests) => nests.concat(parsedData));
         };
      });
      //var t = authToken((token) => {
      //   console.log('callback=',token);
      //});


      setListening(true);
    }
  }, [listening, nests]);
  
  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Momma</th>
          <th>Eggs</th>
          <th>Temperature</th>
        </tr>
      </thead>
      <tbody>
        {
          nests.map((nest, i) =>
            <tr key={i}>
              <td>{nest.momma}</td>
              <td>{nest.eggs}</td>
              <td>{nest.temperature} </td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}

export default TestOrders;
