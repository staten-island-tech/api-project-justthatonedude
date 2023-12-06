import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const IRTdata = [];
  (async () => {
    try {
      const response = await fetch("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs", {
        headers: {
          "x-api-key": "eMMdsAywmZ7Pv9XGupuHY8moCKfdCnkP2LeGCylI",
          // replace with your GTFS-realtime source's auth token
          // e.g. x-api-key is the header value used for NY's MTA GTFS APIs
        },
      });
      if (!response.ok) {
        const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
        error.response = response;
        throw error;
        process.exit(1);
      }
      const buffer = await response.arrayBuffer();
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
        new Uint8Array(buffer)
      );
      /* feed.entity.forEach((entity) => {
          const vehicle = entity.toJSON()
          console.log(vehicle.vehicle);
        }); */
        function FeedManagement(feed){
          feed.entity.forEach((entity)=>{
            const vehicle = entity.toJSON();
            IRTdata.push(vehicle.vehicle);
          })
          console.log(IRTdata);
        };
        FeedManagement(feed);
    }
    catch (error) {
      console.log(error);
      process.exit(1);
    }
  })();
  