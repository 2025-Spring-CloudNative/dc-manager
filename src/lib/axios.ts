import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://140.112.90.36:4000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

export default api