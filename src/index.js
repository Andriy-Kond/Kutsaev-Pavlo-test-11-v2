import axios from 'axios';

const MY_API_KEY = '33373070-0a3de92214998aff69d545527';
const ENDPOINT = 'https://pixabay.com/api/?key=';
// const axios = require('axios');

class ImgApi {
  constructor() {
    this.queryPage = 1;
    this.searchQuery = '';
  }

  async AxioSearch() {
    return await axios
      .get(
        `${ENDPOINT}${MY_API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.queryPage}`
      )
      .then(response => {
        console.log('ImgApi >>> AxioSearch >>> response', response);
        console.log('response.data.totalHits ', response.data.totalHits);
        if (response.data.totalHits === 0) {
          throw new Error(response.statusText);
        }

        // console.log(response.data.totalHits);
        console.log('response.data', response.data);
        return response.data;
      })
      .then(data => {
        console.log('ImgApi >>> AxioSearch >>> data', data);
        this.incrementPage();

        return data;
      });
  }

  resetPage() {
    this.queryPage = 1;
  }

  incrementPage() {
    this.queryPage += 1;
  }
}

// import { ImgApi } from './axiosing.js';
import LoadMoreBtn from './components/LoadMoreBtn.js';
import Notiflix from 'notiflix';
// import axios from 'axios';

const galletyList = document.querySelector('.gallery');
const form = document.getElementById('search-form');

const loadMore = new LoadMoreBtn({
  selector: '.load-more',
  isHiden: true,
});

const imgApi = new ImgApi();

form.addEventListener('submit', onInput);
loadMore.button.addEventListener('click', onLoadMore);

function onInput(e) {
  e.preventDefault();

  imgApi.searchQuery = e.currentTarget.elements.searchQuery.value;
  console.log(imgApi.searchQuery);

  cleanerMarkup(galletyList);

  if (imgApi.searchQuery === '') {
    return;
  }
  imgApi.resetPage();
  loadMore.show();

  onLoadMore().finally(() => form.reset());
}

function createMarkup({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
            <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>${likes}
              </p>
              <p class="info-item">
                <b>Views</b>${views}
              </p>
              <p class="info-item">
                <b>Comments</b>${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>${downloads}
              </p>
            </div>
          </div>
            `;
}

function onLoadMore() {
  loadMore.disable();

  return imgApi
    .AxioSearch()
    .then(({ hits }) => {
      console.log('.then >>> hits', hits);
      // const { totalHits } =  imgApi.AxioSearch();
      // imgApi.countImg += hits.length;
      // console.log(imgApi.countImg);
      // console.log(imgApi.totalHits);

      // if(imgApi.countImg === imgApi.totalHits){
      //   loadMore.disable();
      //   Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
      // }
      const markup = hits.reduce(
        (markup, hits) => createMarkup(hits) + markup,
        ''
      );

      return markup;
    })
    .then(markup => {
      updateGalleryCards(markup);
      loadMore.enable();
    })

    .catch(error =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again!'
      )
    );
}

// Update markup

function updateGalleryCards(markup) {
  galletyList.insertAdjacentHTML('beforeend', markup);
}

//     //   Cleaner

function cleanerMarkup(element) {
  return (element.innerHTML = '');
}
