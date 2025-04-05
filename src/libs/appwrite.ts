import { Client, Account, Databases, Storage, Teams } from 'appwrite';


export const client = new Client();
const PROJECT_ID = import.meta.env.VITE_API_BASE_URL
const PROXY_ENDPOINT = import.meta.env.VITE_PROXY_ENDPOINT

console.log(PROJECT_ID)
client
    .setEndpoint(PROXY_ENDPOINT + '/auth')
    .setProject('67eca511000ac9411da3');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
export { ID } from 'appwrite';
