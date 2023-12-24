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
document.querySelector('body').innerHTML = (`
<div id = "app">
<h1>Open Train Times</h1>
<form action="" id="form">
    <label for="trainsearch">Search for Trains</label>
    <input type="text" name="trainsearch" id="search"/>
    <input type="submit" value="Click Here" />
</form>
<button id = "clear-trips">Clear Trips</button>
<h2 class="infotext">Some notes:</h2>
<p class="infotext">1. Understand that the some routes are abbreivated or named differently from common knowledge.</p>
<p class="infotext">2. These routes are the Staten Island Railway (SI in the API), Franklin Ave Shuttle (FS), and Rockaway Park Shuttle. (H)</p>
<p class="infotext">3. Some routes do not run on certain occasions, such as weekends, which means do check the MTA's schedules before using this.</p>
</div>


<div id = "flexbox"></div>
`);
const DOMSelectors = {
  body: document.querySelector("body"),
  searchQuery: document.querySelector("#search"),
  form: document.querySelector("#form"),
  userInput: document.querySelector("#search"),
  app: document.querySelector('#app'),
  flex: document.querySelector('#flexbox'),
  clearCards: document.querySelector('#clear-trips')
}
DOMSelectors.form.addEventListener("submit", function(event){
  event.preventDefault()
  APICall(); 
  sortFeed(data,output);
  divCreator(output);
  function sortFeed(array,output){
  if (output.length !== 0){
    output.length = 0;
  }
  const userInput = DOMSelectors.searchQuery.value;
  const feed = array.filter((el)=>el.hasOwnProperty("vehicle"))
  const filtered = feed.filter((el)=>el.vehicle.trip.routeId.includes(userInput.toUpperCase()))
  filtered.filter((el)=>output.push(el))
  
}

function divCreator(array){
  array.forEach((el)=>
  DOMSelectors.flex.insertAdjacentHTML(
    "afterbegin",
    `
    <div class=card>
    <p class="output">${"TripID: " + el.id}</p>
    <p class="output">${"Route: " + el.vehicle.trip.routeId}</p>
    <p class="output">${"StopID: " + el.vehicle.stopId}</p>
    <p class="output">${"Stop Sequence Number: " + el.vehicle.currentStopSequence.toString()}</p>
    <p class="output">${"StartTime: " + el.vehicle.trip.startTime}</p>
    </div>`
  ));
  DOMSelectors.userInput.innerHTML = "";
};
function errorHandling(output){
  if (output.length === 0){
    DOMSelectors.flex.insertAdjacentHTML(
      "afterbegin",
      `
      <div class=card>
      <p class="output">"Your search has failed most likely one of 3 reasons."</p>
      <p class="output">"Reason 1: Your search query was invalid. Make sure to type a valid route letter."</p>
      <p class="output">"Reason 2: The API is down for some reason. Please check mta.info for more information on API problems."</p>
      <p class="output">"Reason 3: Some routes do not run on weekends such as the B and W. There is no data on these routes because there are no trains."</p>
      </div>`
    );
  };
}
  function APICall() {
    URLs.forEach(async (URL) => {
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
        document.querySelector("h2").textContent = "The API is unresponsive, please use https://mta.info for up-to-date info on train times."
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
    });
  
    // Add any additional code you want to run after the API call here
  };
  errorHandling(output); 
});


function clearCards(){
DOMSelectors.clearCards.addEventListener("click", function(event){
  const cards = document.querySelectorAll(".card")
  cards.forEach((el)=>el.remove());
});
};
clearCards()