import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import '../css/style.css'
const data = [];
const output = [];
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
document.querySelector('#app').innerHTML = (`
<h1>Open Train Times</h1>
<div class = "app">
<form action="" id="form">
    <label for="trainsearch">Search for Trains</label>
    <input type="text" name="trainsearch" id="search"/>
    <input type="submit" value="Click Here" />
</form>
<button id="theme">Theme Switch</button>
</div>

`);
const DOMSelectors = {
  searchQuery: document.querySelector("#search"),
  form: document.querySelector("#form"),
  theme: document.querySelector("#theme"),
}
DOMSelectors.form.addEventListener("submit", function(event){
  event.preventDefault()
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
    document.querySelector("h2").textContent = "The API is unresponive, please use https://mta.info for up-to-date info on train times."
    throw error;
  }
  const buffer = await response.arrayBuffer();
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
    new Uint8Array(buffer)
  );
    function FeedManagement(feed){
      feed.entity.forEach((entity)=>{
        const vehicle = entity.toJSON()
        data.push(vehicle);
      })
    };
    FeedManagement(feed);
    sortFeed(data);
})
divCreator(output);
});

function sortFeed(array){
  const userInput = DOMSelectors.searchQuery.value
  const feed = array.filter((el)=>el.hasOwnProperty("vehicle"))
  const filtered = feed.filter((el)=>el.vehicle.trip.routeId.includes(userInput))
  filtered.filter((el)=>output.push(el.vehicle.trip))
  
}

function divCreator(array){
  const HTMLoutput = document.querySelectorAll("#output")
  if (HTMLoutput !== undefined,HTMLoutput !== null){
    HTMLoutput.forEach((obj)=>obj.remove())
  }
  array.forEach((obj)=>
  
  DOMSelectors.theme.insertAdjacentHTML(
    "afterend",
    `<div class=box><p id="output">${obj}</p></div>`
  ))
  };