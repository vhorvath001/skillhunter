import axios, { AxiosInstance } from 'axios'

const endpoint: string = 'http://localhost:3500'

// for common config
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const client: AxiosInstance = axios.create({
    baseURL: endpoint
})