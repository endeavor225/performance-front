<template>
     <div id="chart">
        <apexchart type="rangeBar" height="350" :options="data.chartOptions" :series="data.series"></apexchart>
      </div>
</template>
<script>
import fr from "apexcharts/dist/locales/fr.json";
import { defineComponent, onMounted, getCurrentInstance, ref, onBeforeMount } from "vue";

export default defineComponent({
    setup (){
        let data = ref({})

        return{
            data
        }
    }
})

    // setup() {
    //     let data =ref({})

    //     data.value = {
          
    //       series: [
    //         {
    //           data: [
    //             {
    //               x: 'Analysis',
    //               y: [
    //                 new Date('2019-02-27').getTime(),
    //                 new Date('2019-03-04').getTime()
    //               ],
    //               fillColor: '#008FFB'
    //             },
    //             {
    //               x: 'Design',
    //               y: [
    //                 new Date('2019-03-04').getTime(),
    //                 new Date('2019-03-08').getTime()
    //               ],
    //               fillColor: '#00E396'
    //             },
    //             {
    //               x: 'Coding',
    //               y: [
    //                 new Date('2019-03-07').getTime(),
    //                 new Date('2019-03-10').getTime()
    //               ],
    //               fillColor: '#775DD0'
    //             },
    //             {
    //               x: 'Testing',
    //               y: [
    //                 new Date('2019-03-08').getTime(),
    //                 new Date('2019-03-12').getTime()
    //               ],
    //               fillColor: '#FEB019'
    //             },
    //             {
    //               x: 'Deployment',
    //               y: [
    //                 new Date('2019-03-12').getTime(),
    //                 new Date('2019-03-17').getTime()
    //               ],
    //               fillColor: '#FF4560'
    //             }
    //           ]
    //         }
    //       ],
    //       chartOptions: {
    //         chart: {
    //           height: 350,
    //           type: 'rangeBar'
    //         },
    //         plotOptions: {
    //           bar: {
    //             horizontal: true,
    //             distributed: true,
    //             dataLabels: {
    //               hideOverflowingLabels: false
    //             }
    //           }
    //         },
    //         dataLabels: {
    //           enabled: true,
    //           formatter: function(val, opts) {
    //             var label = opts.w.globals.labels[opts.dataPointIndex]
    //             var a = moment(val[0])
    //             var b = moment(val[1])
    //             var diff = b.diff(a, 'days')
    //             return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
    //           },
    //           style: {
    //             colors: ['#f3f4f5', '#fff']
    //           }
    //         },
    //         xaxis: {
    //           type: 'datetime'
    //         },
    //         yaxis: {
    //           show: false
    //         },
    //         grid: {
    //           row: {
    //             colors: ['#f3f4f5', '#fff'],
    //             opacity: 1
    //           }
    //         }
    //       },
          
          
    //     }
    //     return {
    //         data
    //     }
    //   })
</script>