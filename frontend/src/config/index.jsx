import axios from "axios";

export const BASE_URL="https://talentmesh-l4hd.onrender.com";
export const clientServer=axios.create({
    baseURL:BASE_URL
})