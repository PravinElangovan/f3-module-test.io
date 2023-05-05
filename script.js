var userIP;
var locationData;
var postalCode;
var postOffice;
var latEl = document.getElementById('lat');
var longEl = document.getElementById('long');

var cityEl = document.getElementById('city')
var regionEl = document.getElementById('region')
var orgEl = document.getElementById('org');
var hostEl = document.getElementById('host');
var timeZoneEl = document.getElementById('timezone');
var dateTimeEl= document.getElementById('d&t');
var pinCodeEl = document.getElementById('pincode');

var messageEl = document.getElementById('message');
function getIP(json) {
  userIP = json.ip;
  document.getElementById('title').innerText ='My Public IP Address : ' + userIP;
  console.log(userIP);
}

const mapEl = document.getElementById('map');
console.log(mapEl)
function displayMap(lat, long) {
    mapEl.innerHTML = `<iframe src="https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed" width="1020" height="400" frameborder="0" style="border:0" ></iframe>`;
  }
   


var script = document.createElement('script');
script.src = 'https://api.ipify.org?format=jsonp&callback=getIP';
document.head.appendChild(script);

document.getElementById('button').addEventListener('click', () => {
  document.getElementById('second-page').style.display = "block";
  document.getElementById('button').style.display = "none";

  document.getElementById('title').innerText ='My Public IP Address : ' + userIP;
  const apiUrl = `https://ipinfo.io/${userIP}/geo?token=b70f826b611240`;

  // Fetch the location information using the API URL
  fetch(apiUrl)
  .then(response => response.json())
  .then((data) => {
    [lat, long] = data.loc.split(',');
    latEl.textContent = "Lat : "+lat;
    longEl.textContent = "Long : "+long;
    cityEl.textContent = "City : "+data.city;
    regionEl.textContent = "Region : "+data.region;
    orgEl.textContent = "Org : "+data.org;
    hostEl.textContent = "Host : " +`There is no 'host' property given in the object`
    displayMap(lat, long);
    timeZoneEl.textContent = "Time Zone : "+data.timezone;
    dateTimeEl.textContent = "Date & Time : " + new Date().toLocaleString("en-US", { timeZone: `${data.timezone}` });
    pinCodeEl.textContent = "Pincode : "+data.postal;
    return data.postal;
  })
  .then((pin) => {
    let pinCode = pin;
    fetch(`https://api.postalpincode.in/pincode/${pinCode}`)
      .then(response => response.json())
      .then((postalDataArray) => {
        // Storing all post offices present in that pin code in an array
        let postalData = postalDataArray[0];
        messageEl.textContent = "Message : "+postalData.Message;
        let postOfficesInPincodeArray = postalData.PostOffice;
        // display post offices present in that pincode
        

        postOfficesInPincodeArray.map((postOffice =>{
            document.getElementById('card').innerHTML+=`
            <div class="card">
            <div>Name : ${postOffice.Name}</div>
            <div>Branch : ${postOffice.BranchType}</div>
            <div>Deleivery Status : ${postOffice.DeleiveryStatus}</div>
            <div>District : ${postOffice.District}</div>
            <div>Division  : ${postOffice.Division}</div>
            </div>
            `
        }))
        
function displayPostOffices(postOffices, searchTerm) {
    const filteredPostOffices = postOffices.filter(postOffice => {
      const nameMatches = postOffice.Name.toLowerCase().includes(searchTerm.toLowerCase());
      const branchMatches = postOffice.BranchType.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatches || branchMatches;
    });
  
    document.getElementById('card').innerHTML = filteredPostOffices.map(postOffice => `
      <div class="card">
        <div>Name : ${postOffice.Name}</div>
        <div>Branch : ${postOffice.BranchType}</div>
        <div>Delivery Status : ${postOffice.DeliveryStatus}</div>
        <div>District : ${postOffice.District}</div>
        <div>Division : ${postOffice.Division}</div>
      </div>
    `).join('');
  }

  const searchInput = document.getElementById('input');
  searchInput.addEventListener('input', () => {
    displayPostOffices(postOfficesInPincodeArray, searchInput.value);
  });
        
      })
  })


});




