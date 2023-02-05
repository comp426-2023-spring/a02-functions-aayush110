#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from "node-fetch";

let args = minimist(process.argv.slice(2));

if (args.h) {
	console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE');
	console.log('-h            Show this help message and exit.');
	console.log('-n, -s        Latitude: N positive; S negative.');
	console.log('-e, -w        Longitude: E positive; W negative.');
	console.log('-z            Time zone: uses tz.guess() from moment-timezone by default.');
	console.log('-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.');
	console.log('-j            Echo pretty JSON from open-meteo API and exit.');
	process.exit(0);
}

const tz = moment.tz.guess();

if (args.z) {
    var timezone = args.z;
} else { var timezone = tz; }

if (args.n) {
    var North = Math.round((args.n + Number.EPSILON) * 100) / 100;
}
if (args.s) {
    var South = Math.round((args.s + Number.EPSILON) * 100) / 100;
}
if (args.e) {
    var East = Math.round((args.e + Number.EPSILON) * 100) / 100;
}
if (args.w) {
    var West  = Math.round((args.w + Number.EPSILON) * 100) / 100;
}
if (!((North && East) || (North && West) || (South && East) || (South && West))) { 
    console.log('Latitude must be in range') 
    process.exit(0);
}
if (args.n && args.e) {
    var response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + North + '&longitude=' + East + '&timezone' + timezone + '&daily=precipitation_hours');
} else if (args.n && args.w) {
    var response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + North + '&longitude=' + West + '&timezone' + timezone + '&daily=precipitation_hours'); 
} else if (args.s && args.e) {
    var response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-' + South + '&longitude=' + East + '&timezone' + timezone + '&daily=precipitation_hours');
}
  else {
  var response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-' + South + '&longitude=' + West + '&timezone' + timezone + '&daily=precipitation_hours');
}

const data = await response.json();

if (args.j) {
        console.log(data);
        process.exit(0);
}
const days = args.d;

if (days == 0) {
   var day = "today.";
} else if (days > 1) {
   var day = "in " + days + " days.";
} else {
  var day = "tomorrow.";
}

if (days && days != 1) {
   var rainy = data.daily.precipitation_hours[days];
   if (rainy == 0) {
   console.log("You won't need your galoshes " + day);
} else {
   console.log("You will probably need your galoshes " + day);
}

} else {
  var rainy = data.daily.precipitation_hours[1];
  if (rainy == 0) {
      console.log("You won't need your galoshes " + day);
  } else {
     console.log("You will probably need your galoshes " + day);
  }
} 





