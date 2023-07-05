import { boot } from 'quasar/wrappers'
import { date } from 'quasar'
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files

  export default async ({app}) => {

    const dateFormater = (params) => {
      return date.formatDate(params, 'dddd DD MMMM YYYY')
    }
    app.config.globalProperties.$FormatDate = dateFormater

    const dateFormat = (params) => {
      return date.formatDate(params, 'ddd DD MMM YY')
    }
    app.config.globalProperties.$FormatDater = dateFormat

    const dateFormate = (params) => {
      return date.formatDate(params, 'HH:mm:ss')
    }
    app.config.globalProperties.$FormatHeure = dateFormate

    const dateFormaters = (params) => {
      return date.formatDate(params, ' DD MMMM YYYY')
    }

    const datesFormaters = (params) => {
      return date.formatDate(params, 'DD/MMMM/YYYY')
    }
    app.config.globalProperties.$FormatDates = dateFormaters
  }

  