import axios from 'axios';

const endpoint = 'http://localhost:3500';

// for common config
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const client = axios.create({
    baseURL: endpoint
})