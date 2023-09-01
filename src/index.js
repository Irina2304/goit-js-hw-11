

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { createMarcup } from './createMarcup';
import { serviceImg } from './img-api';

const form = document.querySelector(".search-form");
const container = document.querySelector(".gallery");
const btn = document.querySelector(".js-load-more");

btn.classList.replace("load-more", "load-more-hidden");

form.addEventListener("submit", onSubmit);

let perPage = 40;
let currentPage;
let simpleLightBox = new SimpleLightbox('.gallery a');

function onSubmit(evt) {
  btn.classList.replace("load-more", "load-more-hidden");
  evt.preventDefault();
  container.innerHTML = '';
  
  const { searchQuery } = evt.currentTarget.elements;

  if (searchQuery.value === "") {
      throw new Error(noImagesFound());
  }
  
  serviceImg(currentPage = 1, perPage, searchQuery)
  
  .then((data) => {
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      throw new Error(error);
    }
      
    imagesFound(totalHits);

    container.insertAdjacentHTML("beforeend", createMarcup(hits));
    simpleLightBox.refresh();
      
    if (totalHits > perPage) {
      btn.classList.replace('load-more-hidden', 'load-more');
    }
  })
        
  .catch(() => {
    noImagesFound()
  })


  
  btn.addEventListener("click", onLoadMore);

  function onLoadMore() {
    currentPage += 1;
    serviceImg(currentPage, perPage, searchQuery)
      
    .then((data) => {
      const { hits, totalHits } = data;
      container.insertAdjacentHTML("beforeend", createMarcup(hits));
      simpleLightBox.refresh();
      const totalPages = Math.ceil(totalHits / perPage);

      if (currentPage === totalPages) {
        btn.classList.replace("load-more", "load-more-hidden");
        endOfSearch();
      }
    }) 
      
    .catch(() => {
      noImagesFound()
    })
  }  
}

function imagesFound(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function noImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function endOfSearch() {
  Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
}
