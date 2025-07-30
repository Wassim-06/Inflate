import Axios from 'axios'
import { env } from './env'

export const api = Axios.create({
  baseURL: env.BASE_URL,
})


api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

// No changes needed in this file. Instead, update your server's CORS settings.
