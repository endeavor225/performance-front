<template>
    <!-- <div id="chart"> -->
        <!-- <apexchart type="line" height="350" ref="chart" :options="chartOptions"></apexchart> -->
        <apexchart type="rangeBar" height="350" ref="chart" :options="chartOptions" :series="series"></apexchart>
     <!-- </div> -->
</template>

<script>
import qs from "qs";

import { defineComponent, onMounted,  getCurrentInstance, ref, inject} from "vue";
import ApexCharts from 'apexcharts'
import { useQuasar, SessionStorage} from 'quasar'
import { endOfDay, format, compareAsc,  formatDistance, parseISO } from "date-fns";

export default defineComponent({
    components : {
        ApexCharts
    },
    props: {
    mission: {
      type: Object,
      default() {
        return {};
      },
    },
  },
    setup(props) {
          const $q = useQuasar()
          const instance = getCurrentInstance()

          const service = "fonctionnalites"
          const user = $q.sessionStorage.getItem('user')
          const token = $q.sessionStorage.getItem('token')
          let data = ref([])
          let detailMission = ref([])
            let colors =ref([])
            let progression = ref([])
            detailMission = inject('detailMission')
            // console.log('detailMission |', detailMission)
            // console.log('detailM |', detailM);
            // console.log('$detailMission | befor OMount |', instance.appContext.app.config.globalProperties.$detailMission)
            console.log('$detailMission | befor OMount |', instance.appContext.app.config.globalProperties.$detailMission)
          onMounted(async ()=>{
            console.log('$detailMission | OMount |', instance.appContext.app.config.globalProperties.$detailMission)
              // let param = qs.stringify(query.value);
            // let res = await instance.appContext.app.config.globalProperties.$api({
              // url:`/${service}?${param}`,
            // method: "get",
            // headers:{
              //   Authorization: `Bearer ${token}`
            // }
            // })
            // console.log('dara |',props.mission);
          })
              let color
              // datedebut.value = new Date(Date.now)
              console.log(`$q.sessionStorage.getItem('detailM')`,  $q.sessionStorage.getItem('detailM'));
              let detailM =  $q.sessionStorage.getItem('detailM')
                // console.log('detailMission |', typeof(detailMission.value))
              if (detailM !=='') {
                detailM.forEach(e => {
    
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
                  }
                );
              }
            let series = [{
                data : data.value
            }]
            console.log('$detailMission |after OMount |', instance.appContext.app.config.globalProperties.$detailMission)
          // let chartOptions = {
          //   chart: {
          //     height: 350,
          //     type: 'rangeBar'
          //   },
          //   annotations: {
          //     xaxis: [
          //       {
          //       x: new Date(Date.now()).getTime(),
          //       strokeDashArray: 0,
          //       borderColor: '#d32f2f',
          //       label: {
          //         borderColor: '#d32f2f',
          //         style: {
          //           color: '#fff',
          //           background: '#d32f2f',
          //         },
          //         text: `Aujourd'hui`,
          //         orientation: 'horizontal',
          //       }
          //     },
                 
          //     ],
          //   },
          //   plotOptions: {
          //     bar: {
          //       horizontal: true,
          //       distributed: true,
          //       barHeight: '50%',
          //       dataLabels: {
          //         hideOverflowingLabels: false
          //       }
          //     }
          //   },
          //   dataLabels: {
          //     enabled: true,
          //     formatter: function(val, opts) {
          //         // if(progression.value[opts.dataPointIndex] == 100){
          //         //   return 'Terminées'
          //         // }else{
          //         //   if(progression.value[opts.dataPointIndex] == 0){
          //         //     return  'Non débuté'
          //         //   }else{
          //         //     return  progression.value[opts.dataPointIndex] +"% achevé"
          //         //   }
          //         // }
          //         return opts.w.globals.labels[opts.dataPointIndex]+ ' (' + progression.value[opts.dataPointIndex] + '%)'
          //         // console.log(opts.w.globals.labels[opts.dataPointIndex])
          //     },
          //     style: {
          //       fontWeight: 3,
          //       colors:  colors.value
          //     }
          //   },
          //   xaxis: {
          //     type: 'datetime'
          //   },
          //   yaxis: {
          //     show: false
          //   },
          //   stroke: {
          //     width: 1
          //   },
          //   grid: {
          //               yaxis: {
          //           lines: {
          //               show: false
          //           }
          //       }, 
          //     row: {
          //       // colors: ['#E0F2F1', '#E0F2F1'],
          //       opacity: 1
          //     }
          //   },
          //   legend: {
          //     position: 'top',
          //     horizontalAlign: 'left'
          //   }
          // }
          let chartOptions = {
            chart: {
              toolbar: {
                show: true,
                tools:{
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: '<img src="./icons/zoom-out.svg" width="30">',
                  zoomout: '<img src="./icons/zoom-in.svg" width="25">',
                  pan: false,
                  reset: false | '<img src="./icons/mission.svg" width="20">',
                  customIcons: [
                    // {
                    //   icon:'<img src="./icons/zoom-out.svg" width="15">',
                    //   index: 0,
                    //   title: 'tooltip of the icon',
                    //   class: 'custom-icon',
                    //   click: function (chart, options, e) {
                    //     console.log(e)
                    //     console.log(options)
                    //     console.log(chart)
                    //   }
                    // },
                    // {
                    //   icon:'<img src="./icons/zoom-in.svg" width="25">',
                    //   index: 1,
                    //   title: 'tooltip of the icon',
                    //   class: 'custom-icon',
                    //   click: function (chart, options, e) {
                    //     console.log("clicked custom-icon")
                    //   }
                    // }
                  ]
                }
              },
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
                  return opts.w.globals.labels[opts.dataPointIndex]+ ' (' + progression.value[opts.dataPointIndex] + '%)'
              },
          
              style: {
                colors:  colors.value
              }
            },
            
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