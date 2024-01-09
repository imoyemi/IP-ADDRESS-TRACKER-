const form = document.querySelector('form');
const inputValue = document.querySelector('input');


const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map)


    
    function curSuccess(pos){
       const lag = pos.coords.latitude;
       const lng = pos.coords.longitude;

       marker.setLatLng([lag,lng]).update();
       map.setView([lag,lng],13)
    //    marker.bindPopup('current location')
    //    .openPopup();
    }
    function curError(err){
        console.log(err)
    }
    const options = {}

    navigator.geolocation.getCurrentPosition(curSuccess,curError,options)

    async function getLoction (){
        const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_Rws50uKSEQQY5YtpI1qfzIkzr33af&ipAddress=${inputValue.value}`)
        const data = await res.json()
        try {  
            if(!navigator.onLine){
                throw new  Error("no internet connention")
            }
            if(data.code === 422){
                throw new Error(data.messages)
            }
            else{

                // console.log(data.location)
                document.querySelector(".ip_info_number").textContent = data.ip
                document.querySelector(".loc_info_number").textContent = data.location.region;
                document.querySelector(".tz_info_number span").textContent = `UTC${data.location.timezone}`;
                document.querySelector(".isp_info_number ").textContent = data.isp;
                
                marker.setLatLng([data.location.lat,data.location.lng]).update();
                map.setView([data.location.lat,data.location.lng],15)
                // marker.bindPopup('')
                // .openPopup();

               
            }
        }
        catch (error) {
            error
        }

        return data
    }
    
    form.addEventListener("submit", async (e)=>{
        e.preventDefault()
        const data = await getLoction()
         if(data.messages){
            inputValue.classList.add("error")
            document.querySelector('label').textContent = data.messages
         }
         else{
            inputValue.classList.remove("error")
            document.querySelector('label').textContent = ""
         }
        getLoction()
    })

    window.addEventListener("DOMContentLoaded",getLoction)