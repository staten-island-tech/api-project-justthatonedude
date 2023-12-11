import {data} from './GTFS_recieve.js'


const trips = [];
data.forEach((trip)=>trips.push(trip.trip))

console.log(trips.trip)