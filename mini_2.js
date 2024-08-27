const usertab = document.querySelector("[data-userWeather]");
const searchtab = document.querySelector("[data-searchWeather]");

const usercontainer = document.querySelector(".weather-container");
const grantaccessContainer = document.querySelector(".grant-location-container");
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container");
const userinfoContainer = document.querySelector(".user-info-container");

// initially value.

let currentTab = usertab;
let API_KEY = "1a6ad725db82bfb608774a49cdcc4797";
currentTab.classList.add("current-tab");
getfromSessionStorage(); // initially might have latitude or longitude is present.

// function to switch tab
function switchtab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(! searchform.classList.contains("active")){ // agr search form main active nhi h iska mtlb search wale pe h jana h ...hum already usertab pe h
            // 2 chize remove krni  h 
            userinfoContainer.classList.remove("active");
            grantaccessContainer.classList.remove("active");
            // ek ko show krna h
            searchform.classList.add("active");
        }
        else{
            // 1 ko remove krna while switching to userpage
            searchform.classList.remove("active");
            // 2 ko show krna h
            userinfoContainer.classList.add("active");
            grantaccessContainer.classList.add("active");
            // ab mughe usertab main weather show krna pdega ..so let's check local cordinate first we saved them
            getfromSessionStorage();
        }
    }
}
usertab.addEventListener("click",()=>{  // user tab pe humne event listner lga rakha h ki agr uspe click hua toh usertab aa jaega screen pe
    // pass clicked tab as input tab
    switchtab(usertab);
});

searchtab.addEventListener("click",()=>{
    switchtab(searchtab);
});

// check if cordinates are already present in session storage
function getfromSessionStorage(){
    const localcordinates = sessionStorage.getItem("user-cordinates");
    if(! localcordinates){
        // agr local cordinates nhi mile
        grantaccessContainer.classList.add("active");
    }
    else{
        const cordinates = JSON.parse(localcordinates); // local cordinates ko json format mai convert krke api call function call kr diya for data fetching.
        fetchUserWeatherInfo(cordinates); 
    }
}

// fetching data
async function fetchUserWeatherInfo(cordinates){

    const {lat, lon} = cordinates;
    // make grantcontainer invisible
    grantaccessContainer.classList.remove("active");
    // make loader visible
    loadingscreen.classList.add("active");

    // api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingscreen.classList.remove("active");
        userinfoContainer.classList.add("active");

        // rendor function joh ki tumhare data se value nikal ke dalega UI pe
        renderfunctioninfo(data);
    }
    catch(e){
       loadingscreen.classList.remove("active");

    }
}

// for weather data
function renderfunctioninfo(weatherInfo){
    // firstly we have to fetch the data
    const cityname = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherdescription]");
    const weathericon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudness = document.querySelector("[data-clouds]");

    // fetch value form weather info  (optional chaining  ...  ?.user?.address.zip)
    cityname.innerText = weatherInfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weathericon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =  `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText =`${weatherInfo?.main?.humidity}%`;
    cloudness.innerText = `${weatherInfo?.clouds?.all}%`;

}
// to get current location
function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
          // browser is not supported for latitude and longitude
    }
}
function showPosition(position){
    const usercordinates = {
        lat: position.coords.latitude, 
        lon: position.coords.longitude,

    }
    sessionStorage.setItem("user-cordinates",JSON.stringify(usercordinates));
    fetchUserWeatherInfo(usercordinates);
}
const grantaccessbtn = document.querySelector("[data-grantAccess]");
grantaccessbtn.addEventListener("click", getlocation);

// function for search button

const searchinput = document.querySelector("[data-searchInput]");
searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname = searchinput.value;
    
    if(cityname == "")return;
    else{
        fetchcityweatherinfo(cityname);
    }

})

async function fetchcityweatherinfo(city){
    // 1 add
    loadingscreen.classList.add("active");
    // 2 remove
    userinfoContainer.classList.remove("active");
    grantaccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfoContainer.classList.add("active");
        renderfunctioninfo(data);
    }
    catch(e){
        // failed to fetch details.
    }
}



