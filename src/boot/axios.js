import { boot } from 'quasar/wrappers'
import axios from 'axios'

//const api = axios.create({ baseURL: 'http://144.126.150.132:1337' })
//const api = axios.create({ baseURL: 'https://performance-back.jool-tech.com' })

const api = axios.create({ baseURL: 'http://localhost:1337' })

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
