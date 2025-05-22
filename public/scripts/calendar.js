import { api } from "/scripts/api.js";

const data = await api("/profile");
console.log(data);