import GtfsRealtimeBindings from "gtfs-realtime-bindings";

export const data = [];
const URLs = [
   "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
   "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
   "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
   "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",
   "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
   "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
   "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
   "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si",
]; 

URLs.forEach(async (URL)=>{
  const response = await fetch(URL, {
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
  }
  const buffer = await response.arrayBuffer();
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
    new Uint8Array(buffer)
  );
    function FeedManagement(feed){
      feed.entity.forEach((entity)=>{
        const vehicle = entity.toJSON();
        data.push(vehicle.vehicle);
      })
      console.log(data);
    };
    FeedManagement(feed);
});
      
    
      