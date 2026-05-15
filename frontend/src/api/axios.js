import axios from 'axios'

const api = axios.create({

 baseURL: "http://65.2.130.19:8000"

})

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem('token')

    if (token) {

      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  (error) => {

    return Promise.reject(error)
  }

)

export default api