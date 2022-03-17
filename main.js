const container = document.querySelector('.con')
const timeContainer = document.querySelector('.timezone-display')
const cityName = document.querySelector('.city')
const tz_display = document.querySelector('.timezone-display')

let intervalID
let zones = []
// setInterval(() => {

//   document.querySelector('.digital').innerText = new Date().toLocaleTimeString()
// }, 1000)
tz_display.innerText = 'Time zone: ' + Intl.DateTimeFormat().resolvedOptions().timeZone
document.body.style.zoom = 1.2; this.blur();

async function fetchTimeZones() {
  let data = await fetch('res/zones.json')
  let countries = await data.json()
  console.log(countries[0]);
  // console.log(countries[0].IsoAlpha3);
  // console.log(countries[0].TimeZones[0]);

  // console.log(getDate(countries[0].TimeZones[0]));
  let countryObjs = []


  for (let c of countries) {
    let zone = scrapZone(c)
    zones.push(zone)
    const dateTime = getDateTime(zone)
    const cName = scrapCountryName(c)

    const obj = new TimePlace(cName, dateTime, zone)
    console.log(obj.getDateString(), obj.getTimeString());

    countryObjs.push(obj)

    // console.log(dateTime, cName);
  }

  fillTimeZones(zones)
  console.log('zones:', zones);
  console.log('size:', zones.length);

  // console.log('Size', countryObjs.length);
  return countryObjs
}


function getZone(countries, index) {
  for (var i = 0; i < countries.length; i++) {
    if (i == index)
      return countries[i].TimeZones
  }
}


function getZones() {
  return zones;
}

class TimePlace {
  constructor(countryName, dateTime, zone) {
    this.CountryName = countryName
    this.dateTime = dateTime
    this.zone = zone
  }

  getCountryName() {
    return (this.CountryName)
  }

  getDateString() {
    let date = this.dateTime.split(' ')[0].slice(0, -1)
    return (date);
  }

  getTimeString() {
    let time = this.dateTime.split(' ')[1]
    return (time);
  }

  getZone() {
    return this.zone
  }
}



function getDateTime(timezone) {
  var d = new Date(); /* midnight in China on April 13th */
  return d.toLocaleString('en-US', { timeZone: timezone });
}

function scrapZone(country) {
  let timeZones = country.TimeZones
  return timeZones[0]
}

function scrapCountryName(country) {
  return country.CountryName
}

async function fillSelectList() {
  let countries = await fetchTimeZones()
  console.log(countries);

  var selectList = document.querySelector(".c-select");

  for (var i = 0; i < countries.length; i++) {
    var option = document.createElement("option");
    console.log(countries[i].getZone());
    option.value = countries[i].getZone() + ' ' + countries[i].getCountryName()
    option.text = countries[i].getCountryName()
    selectList.appendChild(option);
  }
}

fillSelectList()

function fillTimeZones(zones) {
  var zoneSelect = document.querySelector('.timezone')
  console.log(zoneSelect);


  for (var i = 0; i < zones.length; i++) {
    var option = document.createElement("option");
    option.text = zones[i]
    option.value = zones[i]
    zoneSelect.appendChild(option)
  }
}



document.querySelector('.c-select').onchange = function () {
  let textCon = document.querySelector('.timezone-display')
  cityName.style.color = 'grey'
  cityName.innerText = (this.value.split(' ')[1])                // city name
  textCon.innerText = 'Time zone: ' + this.value.split(' ')[0]   // timezone
  clearInterval(intervalID)
  setTime(this.value.split(' ')[0])
}




function setTime(timeZone) {
  //update the current time every second
  if (timeZone == null) {
    intervalID = setInterval(() => {
      let date = new Date();
      let options = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
      let time = new Intl.DateTimeFormat('en-US', options).format(date);

      document.querySelector('.digital').innerText = time;

      options = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
      }

      let currentTimeAnalog = new Intl.DateTimeFormat('en-US', options).format(date);

      let hr = currentTimeAnalog.split(':')[0];
      let min = currentTimeAnalog.split(':')[1];
      let sec = currentTimeAnalog.split(':')[2];

      hr_rotation = 30 * hr + min / 2;
      min_rotation = 6 * min;
      sec_rotation = 6 * sec;

      hour.style.transform = `rotate(${hr_rotation}deg)`;
      minute.style.transform = `rotate(${min_rotation}deg)`;
      second.style.transform = `rotate(${sec_rotation}deg)`;


    }, 1);
  } else {
    console.log('else');
    console.log(timeZone);
    intervalID = setInterval(() => {
      let date = new Date();
      let options = {
        timeZone: timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
      let time = new Intl.DateTimeFormat('en-US', options).format(date);

      document.querySelector('.digital').innerText = time;

      options = {
        timeZone: timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
      }

      let currentTimeAnalog = new Intl.DateTimeFormat('en-US', options).format(date);

      let hr = currentTimeAnalog.split(':')[0];
      let min = currentTimeAnalog.split(':')[1];
      let sec = currentTimeAnalog.split(':')[2];

      hr_rotation = 30 * hr + min / 2;
      min_rotation = 6 * min;
      sec_rotation = 6 * sec;

      hour.style.transform = `rotate(${hr_rotation}deg)`;
      minute.style.transform = `rotate(${min_rotation}deg)`;
      second.style.transform = `rotate(${sec_rotation}deg)`;


    }, 1);
  }

}

setTime(null)


// storage
function checkStorage() {

}

function save(cityName, timezone) {
  var obj = {
    name: cityName, tz: timezone
  }
  console.log(obj);

  let savedList = JSON.parse(getSavedCities()) || []
  savedList.push(obj)  // update

  localStorage.setItem('saved-cities', JSON.stringify(savedList))   // save
}


function getSavedCities() {
  let cities = localStorage.getItem('saved-cities')
  return cities;
}


// saving city and tz

document.querySelector('.new-city').addEventListener('submit', (event) => {
  event.preventDefault()
  let data = new FormData(document.querySelector('.new-city'))

  let cityName = data.get('city-name')
  let tz = data.get('timezone')

  save(cityName, tz)
  console.log(cityName);
})

function readStorage() {
  let data = localStorage.getItem('saved-cities')
  let json = JSON.parse(data)

  var savedCitiesSelect = document.querySelector('.saved-cities')
  for (let city of json) {
    var option = document.createElement("option");
    option.text = city.name
    option.value = city.tz + ' ' + city.name

    savedCitiesSelect.appendChild(option)
  }
  console.log(json);
}
readStorage()

document.querySelector('.saved-cities').onchange = function () {
  clearInterval(intervalID)
  cityName.style.color = 'grey'
  cityName.innerText = (this.value.split(' ')[1])
  setTime(this.value.split(' ')[0])
  tz_display.innerText = 'Time zone: ' + this.value.split(' ')[0]
}