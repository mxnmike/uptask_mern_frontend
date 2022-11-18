import axios from 'axios'

const axiosAPIClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_API_URL}`,
})

export default axiosAPIClient
