import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_BASE_URL;
export const $axios = axios.create({
  baseURL,
  headers: {
    post: {
      'Access-Control-Allow-Origin': "*"
    }
  }
});
