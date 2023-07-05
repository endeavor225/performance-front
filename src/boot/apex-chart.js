import { boot } from 'quasar/wrappers'
import VueApexCharts from 'vue3-apexcharts';

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.use(VueApexCharts)
  
})

