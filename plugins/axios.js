import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Swal from 'sweetalert2'

Vue.use(VueAxios, axios);

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default ({ app, store, redirect }) => {
  axios.defaults.baseURL = process.env.authApiUrl

  if (process.server) {
    return
  }

  // Request interceptor
  axios.interceptors.request.use((request) => {
    request.baseURL = process.env.authApiUrl

    const token = store.getters['auth/token']

    if (token) {
      request.headers.common.Authorization = `Bearer ${token}`
    }

    return request
  })

  // Response interceptor
  axios.interceptors.response.use(response => response, (error) => {
    const { status } = error.response || {}

    if (status >= 500) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again.',
        reverseButtons: true,
        showCancelButton: true,
      })
    }

    if (status === 401 && store.getters['auth/check']) {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired!',
        text: 'Please log in again to continue.',
        reverseButtons: true,
      }).then(() => {
        store.commit('auth/LOGOUT')

        redirect({ name: 'index' })
      })
    }

    return Promise.reject(error)
  })
}
