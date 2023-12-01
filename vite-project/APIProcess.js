/* const https = require('https');
https.get(
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  { headers: { "x-api-key": 'eMMdsAywmZ7Pv9XGupuHY8moCKfdCnkP2LeGCylI'}
  },
  (resp) => {
    resp.on('data', (chunk) => {
      console.log("Receiving Data");
    });
    resp.forEach((el)=>console.log(el));
    resp.on('end', () => {
      console.log("Finished receiving data");
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  }); */

  async function logTrains() {
    const headers = {"x-api-key": 'eMMdsAywmZ7Pv9XGupuHY8moCKfdCnkP2LeGCylI'};
    const response = await fetch("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw", headers);
    const Trains = await response.json();
    console.log(Trains);
  }
  logTrains()