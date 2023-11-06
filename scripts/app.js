const   wrapper     = document.querySelector(".wrapper");
        inputPart   = document.querySelector(".input-part");
        infoTxt     = inputPart.querySelector(".info-txt");
        inputFiled  = document.querySelector("input");
        locationBtn = document.querySelector("button");
        weatherPart = wrapper.querySelector(".weather-part");
        wIcon       = weatherPart.querySelector("img");
        arrowBack   = wrapper.querySelector("header i");


let api; //1.도시명검색 api , 2.위도 경도 입력 api

inputFiled.addEventListener('keyup', e => {
    if(e.key == 'Enter' && inputFiled.value != '' ){
        requestApi(inputFiled.value);

    }

})

locationBtn.addEventListener('click', ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else {
        alert('이 브라우저는 위치정보를 제공하지 않습니다');
    }
})

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=1e7c1e3d8c0a28c6883740779b5d921d`;
    fetchData();
}

function onSuccess(position){
    const{latitude, longitude} = position.coords; //위도 경도
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=1e7c1e3d8c0a28c6883740779b5d921d`;
    fetchData();
}

function onError(error){
    if(error.code == 1){
        infoTxt.innerText = '현재 위치 요청을 거부 했습니다.'
    }else if(error.code == 2){
        infoTxt.innerText = '위치 정보를 사용할 수 없습니다.'
    }else{
        infoTxt.innerText = '알 수 없는 오류가 발생 했습니다.'
    }
    infoTxt.classList.add('error');
}

function fetchData(){
    infoTxt.innerText = '날씨 정보를 가져옵니다...'
    infoTxt.classList.add('pending');

    fetch(api)
        .then(res => res.json())
        .then(result => weatherDetails(result))
        .catch(()=> {
            infoTxt.innerText = '오류가 발생 했습니다.';
            infoTxt.classList.replace('pending','error');
        })
}

function weatherDetails(info){
    console.log(info)
    if(info.cod == '404'){
            infoTxt.classList.replace('pending', 'error');
            infoTxt.innerText = `${inputFiled.value} 이런 도시는 없는뎅.`;

    }else {
        //날씨 정보 가져옴
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        const icon = info.weather[0].icon;

        wIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        // if(id == 800){
        //         //'icons/clear.svg';
        // }else if (id >= 200 && id <= 232){
        //     wIcon.src = 'icons/storm.svg';
        // }else if (id >= 600 && id <= 622){
        //     wIcon.src = 'icons/snow.svg';
        // }else if (id >= 700 && id <= 781){
        //     wIcon.src = 'icons/have.svg';
        // }else if (id >= 801 && id <= 804){
        //     wIcon.src = 'icons/cloud.svg';
        // }else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
        //     wIcon.src = 'icons/rain.svg';
        // }

        //디테일한 날씨정보 표시
        weatherPart.querySelector('.temp .numb').innerText = temp.toFixed(1);
        weatherPart.querySelector('.weather').innerText = description;
        weatherPart.querySelector('.location span').innerText = `${city}, ${country}`;
        weatherPart.querySelector('.temp .numb-2').innerText = feels_like.toFixed(1);
        weatherPart.querySelector('.humidity span').innerText = `${humidity}%`;


        infoTxt.classList.remove('pending', 'error');
        infoTxt.innerText = "";
        inputFiled.value = '';
        wrapper.classList.add("active");


    }
}

arrowBack.addEventListener('click', function(){
    wrapper.classList.remove("active");
})