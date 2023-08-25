import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import './styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import axios from "axios";

axios.defaults.headers.common["x-api-key"] = "live_rt8pJpGcquwXEgB7yDC5N2MMasejX6SUHwn394oDI7GTvkWpc58nGWN7QbGMDbCB";

// https://api.thecatapi.com/v1
const selector = document.querySelector('.breed-select');
const divCatInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

loader.classList.replace('loader', 'is-hidden');
error.classList.add('is-hidden');
divCatInfo.classList.add('is-hidden');

let arrBreedsId = [];
fetchBreeds()
.then(data => {
    data.forEach(element => {
        arrBreedsId.push({text: element.name, value: element.id});
    });
    new SlimSelect({
        select: selector,
        data: arrBreedsId
    });

    // Відображення інформації про кота при виборі породи
    selector.addEventListener('change', onSelectBreed);
})
    .catch(onFetchError);

function onSelectBreed(event) {
    const breedId = event.currentTarget.value;

    if (breedId) {
        loader.classList.replace('is-hidden', 'loader');
        selector.classList.add('is-hidden');
        divCatInfo.classList.add('is-hidden');
          
        fetchCatByBreed(breedId)
            .then(data => {
                loader.classList.replace('loader', 'is-hidden');
                selector.classList.remove('is-hidden');
                const { url, breeds } = data[0];
        
                divCatInfo.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`;
                divCatInfo.classList.remove('is-hidden');
            })
            .catch(onFetchError);
    }
}

function onFetchError(error) {
    selector.classList.remove('is-hidden');
    loader.classList.replace('loader', 'is-hidden');

    Notify.failure('Oops! Something went wrong! Try reloading the page or select another cat breed!', {
        position: 'center-center',
        timeout: 5000,
        width: '400px',
        fontSize: '24px'
    });
};





