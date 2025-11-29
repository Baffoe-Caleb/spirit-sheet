import { create } from 'apisauce';
import apisauce from 'apisauce';

const createApi = apisauce.create({
  baseURL: "http://localhost:5000",
  // baseURL: "https://api.chucknorris.io/jokes",
  headers: {
    "Cache-Control": "no-cache",
  },
  timeout: 60000,
})



const getCategories = () => createApi.get("/categories")

const getMembers = () => createApi.get("api/members")

export default { getCategories, getMembers }