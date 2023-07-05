<template>
    <!-- <div id="chart"> -->
        <!-- <apexchart type="line" height="350" ref="chart" :options="chartOptions"></apexchart> -->
        <apexchart type="rangeBar" height="350" ref="chart" :options="chartOptions" :series="series"></apexchart>
     <!-- </div> -->
</template>

<script>
import qs from "qs";

import { defineComponent, onMounted,  getCurrentInstance, ref} from "vue";
import ApexCharts from 'apexcharts'
import { useQuasar} from 'quasar'
import { endOfDay, format, compareAsc,  formatDistance, parseISO } from "date-fns";

export default defineComponent({
    components : {
        ApexCharts
    },
    setup() {
          const $q = useQuasar()
          const instance = getCurrentInstance()

          const service = "fonctionnalites"
          const user = $q.sessionStorage.getItem('user')
          const token = $q.sessionStorage.getItem('token')
          let data = ref([])
            let colors =ref([])
            let progression = ref([])
          const query = ref({
            _where: {},
            _sort: "debut",
          });

          onMounted(async ()=>{
            let param = qs.stringify(query.value);
            let res = await instance.appContext.app.config.globalProperties.$api({
            url:`/${service}?${param}`,
            method: "get",
            headers:{
              Authorization: `Bearer ${token}`
            }
            })
            console.log('dara |',res.data);
              let color
              // datedebut.value = new Date(Date.now)
            res.data.forEach(e => {

              // console.log('fonctionalité |', e.titre)
              progression.value.push(e.progression)
              if (e.progression == 0) {
                color = '#bdbdbd'
                colors.value.push('#000')
              }
              if (e.progression == 100) {
                color = '#21BA45'
                colors.value.push('#fff')
              }
              if (e.progression > 0 && e.progression < 100) {
                color = '#F2C037'
                colors.value.push('#000')
              }
              data.value.push({
                x : e.titre,
                y: [
                  new Date(e.debut).getTime(),
                  new Date(e.fin).getTime(),
                ],
                fillColor : color
              })
            });
          })
            let series = [{
                data : data.value
            }]
        // let series = [
        //     {
        //       data: [
        //         {
        //           x: 'Analysis',
        //           y: [
        //             new Date('2019-02-27').getTime(),
        //             new Date('2019-03-04').getTime()
        //           ],
        //           fillColor: '#008FFB'
        //         },
        //         {
        //           x: 'Design',
        //           y: [
        //             new Date('2019-03-04').getTime(),
        //             new Date('2019-03-08').getTime()
        //           ],
        //           fillColor: '#00E396'
        //         },
        //         {
        //           x: 'Coding',
        //           y: [
        //             new Date('2019-03-07').getTime(),
        //             new Date('2019-03-10').getTime()
        //           ],
        //           fillColor: '#775DD0'
        //         },
        //         {
        //           x: 'Testing',
        //           y: [
        //             new Date('2019-03-08').getTime(),
        //             new Date('2019-03-12').getTime()
        //           ],
        //           fillColor: '#FEB019'
        //         },
        //         {
        //           x: 'Deployment',
        //           y: [
        //             new Date('2019-03-12').getTime(),
        //             new Date('2019-03-17').getTime()
        //           ],
        //           fillColor: '#FF4560'
        //         }
        //       ]
        //     }
        //   ]
          let chartOptions = {
            chart: {
              height: 350,
              type: 'rangeBar'
            },
            annotations: {
              xaxis: [
                {
                x: new Date(Date.now()).getTime(),
                strokeDashArray: 0,
                borderColor: '#d32f2f',
                label: {
                  borderColor: '#d32f2f',
                  style: {
                    color: '#fff',
                    background: '#d32f2f',
                  },
                  text: `Aujourd'hui`,
                  orientation: 'horizontal',
                }
              },
                // {
                //   x1: 0,
                //   x2: new Date(Date.now()).getTime(),
                //   fillColor: '#ff6659',
                //   opacity: 0.1,
                //   label: {
                //     offsetY: 10,
                //   text: 'X-axis range',
                //   }
                // }
              ],
            },
            plotOptions: {
              bar: {
                horizontal: true,
                distributed: true,
                dataLabels: {
                  hideOverflowingLabels: false
                }
              }
            },
            dataLabels: {
              enabled: true,
              formatter: function(val, opts) {
                  if(progression.value[opts.dataPointIndex] == 100){
                    return 'Terminées'
                  }else{
                    if(progression.value[opts.dataPointIndex] == 0){
                      return  'Non débuté'
                    }else{
                      return  progression.value[opts.dataPointIndex] +"% achevé"
                    }
                  }
              },
            //     var label = opts.w.globals.labels[opts.dataPointIndex]
            //     var a = moment(val[0])
            //     var b = moment(val[1])
            //     var diff = b.diff(a, 'days')
            //     return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
            //   },
              style: {
                colors:  colors.value
              }
            },
            // fill: {
            //   type: 'gradient',
            //   gradient: {
            //     // shade: 'white',
            //     type: "horizontal",
            //     shadeIntensity: 0.5,
            //     gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            //     inverseColors: true,
            //     opacityFrom: 1,
            //     opacityTo: 1,
            //     // stops: [70, 50, 100, 10],
            //     colorStops: []
            //   }
            // },
            xaxis: {
              type: 'datetime'
            },
            yaxis: {
              show: false
            },
            grid: {
              row: {
                colors: ['#f3f4f5', '#fff'],
                opacity: 1
              }
            }
          }
        return{
            chartOptions,
            series
        }
    },
})
</script>