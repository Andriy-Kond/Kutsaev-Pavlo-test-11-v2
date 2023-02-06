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

export { ImgApi };
