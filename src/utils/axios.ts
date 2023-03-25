import axios from 'axios';

const LOCAL_BASE_URL = 'http://localhost:8080';
const PROD_BASE_URL = 'https://imaster-be.vercel.app';
const instance = axios.create({
  baseURL: LOCAL_BASE_URL,
});

export default instance;
