import './css/styles.css';
import GalleryApiService from './gallery-service';
import LoadMoreButton from './load-more-btn';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const form = {
  body: document.querySelector('#search-form'),
  input:  document.querySelector('input[name="searchQuery"]'),
  button: document.querySelector('button[type="submit"]'),
}

const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.active');
const galleryApiService = new GalleryApiService();
const btnLoadMore = new LoadMoreButton({selector: '.active'});

form.body.addEventListener('click', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(evt){
  evt.preventDefault();

  if(evt.target.nodeName !== "BUTTON"){
    return;
  }

  galleryApiService.query = evt.currentTarget.elements.searchQuery.value;
  galleryApiService.resetPage();
  galleryApiService.clearElements(gallery, btnLoadMore);
  if(galleryApiService.query === ''){
    return galleryApiService.notifyOnEmptyQuery();
  }
  
  try{
    const data = await galleryApiService.fetchValue();
    createElements(data);
    lightBox();
    if(data.totalHits >= galleryApiService.per_page){
      btnLoadMore.show();
    }
  }catch(error){
    galleryApiService.notifyOnError();
  }

}

async function onLoadMore(evt){
  evt.preventDefault();

  if(evt.target.nodeName !== "BUTTON"){
    return;
  }
  btnLoadMore.hide();

  try{
    const data = await galleryApiService.fetchValue();

    createElements(data);
    windowScroll();
    lightBox();
    btnLoadMore.show();
    galleryApiService.notifyTotalHits(data.totalHits, data.hits, btnLoadMore);
  }catch(error){
    galleryApiService.notifyOnError();
  }
}

function createElements({hits}){
  const countryValues = hits.map(hit => {
    const width = 640;
    const newWebformatURL = hit.webformatURL.replace(width, '340');
    gallery.insertAdjacentHTML("beforeend",`<div class="photo-card">
    <a href="${hit.largeImageURL}">
    <img src="${newWebformatURL}" alt="" loading="lazy"/>
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b><br>
        ${hit.likes}
      </p>
      <p class="info-item">
        <b>Views</b><br>
        ${hit.views}
      </p>
      <p class="info-item">
        <b>Comments</b><br>
        ${hit.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b><br>
        ${hit.downloads}
      </p>
    </div>
  </div>`);
    
  });
  return countryValues;
}

function lightBox(){
  const galleryLightbox = new SimpleLightbox('.gallery a', { });
  galleryLightbox.refresh();
}

function windowScroll(){
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
  });
}
