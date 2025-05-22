import App from "./App.js";

import { api } from "/scripts/api.js";

const data = await api("/profile");
console.log(data);

const root = document.getElementById("app");
const app = new App(root);