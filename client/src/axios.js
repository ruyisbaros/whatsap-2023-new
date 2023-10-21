import axios from "axios";

export let BASE_ENDPOINT = "";
//BASE_ENDPOINT = 'https://api.dev.somethingserver.xyz';
// when developing locally, change this value to local
export const APP_ENVIRONMENT = "local";

if (APP_ENVIRONMENT === "local") {
  BASE_ENDPOINT = "https://localhost:5000";
} /* else if (APP_ENVIRONMENT === "development") {
  BASE_ENDPOINT = "https://ineedsomething.herokuapp.com";
} else if (APP_ENVIRONMENT === "staging") {
  BASE_ENDPOINT = "https://ineedsomething.herokuapp.com";
} else if (APP_ENVIRONMENT === "production") {
  BASE_ENDPOINT = "https://ineedsomething.herokuapp.com";
} */

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;
//console.log(BASE_ENDPOINT)
export const BACKEND_URL = "https://localhost:5000";
export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: true,
});
