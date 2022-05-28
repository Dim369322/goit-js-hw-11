import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const API_KEY = '27573570-f402641a622ce8865d801365d';    
const postToAdd = {
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
};
const options = {
    method: "POST",
    body: JSON.stringify(postToAdd),
    headers: {
    "Content-Type": "application/json; charset=UTF-8",
    },
};

export default class GalleryApiService{
    constructor(){
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }

    fetchValue(){
          return  axios.get(`https://pixabay.com/api/?key=${API_KEY}&per_page=${this.per_page}&page=${this.page}&q=${this.searchQuery}`, options)
          .then(res => {
            if(res.data.total === 0){
              throw new Error();
            }
            this.incrementPage();
            return res.data;
          });
    } 

    get query(){
        return this.searchQuery;
    }

    set query(newQuery){
        this.searchQuery = newQuery;
    }

    incrementPage(){
        this.page += 1;
    }

    resetPage(){
        this.page = 1;
    }

    checkPage(){
       return this.page - 2;
    }

    notifyOnError(){
        return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
      
    notifyOnFinishTotalHits(){
       return Notify.failure("We're sorry, but you've reached the end of search results.");
    }
      
    notifyOnEmptyQuery(){
        return Notify.failure("You haven't entered anything.");
    }
      
    notifyTotalHits(totalhits, hits , btn){
        let total = totalhits - (this.checkPage() * hits.length);
        if(total < hits.length){
            Notify.info("We're sorry, but you've reached the end of search results.");
            return  btn.hide();
        }
        return Notify.info(`Hooray! We found ${total} images.`);
    }

    clearElements(element, btn){
        element.innerHTML = '';
       return btn.hide();
    }   
}