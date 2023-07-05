<template>
  <q-page >
    <!-- content -->
    <h3  style="margin-top: 25px">
      Tableau de bord
    </h3>
     <!-- résumé total des missions -->
    <div v-if="evaluation.length > 0" >
      <h4>Resumé des Mission</h4>
      <div class="row" >
        <!-- application -->
        <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm" >
          <div class=" q-pa-md bg-teal-1 ">
            <q-card-section horizontal class="items-center">
                <div class="q-pr-md" >
                  <q-avatar color="teal-10" text-color="teal-1" icon="apps" size="lg"/>
                </div>
                <div class=""> <span class="text-h6 text-weight-light ">Application</span> <br> </div> 
                <q-space />
                <div class="q-ml-md text-center text-weight-bold" style="font-size: 40px"> 
                  <span>{{total.missions}}</span>
                </div>
            </q-card-section>
          </div>
        </div>

        <!-- fonctionnalités -->
        <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm">
          <div class="  q-pa-md bg-teal-1 ">
            <q-card-section horizontal class="items-center">
                <div class="q-pr-md" >
                  <q-avatar color="teal-10" text-color="teal-1" icon="task" size="lg" />
                </div>
                <div class="" > <span class="text-h5 text-weight-light">Fonctionnalités</span> <br> </div> 
                <q-space />
                <div class="q-ml-md text-center text-weight-bold" style="font-size: 40px"> 
                  <span>{{total.fonctionnalites}}</span>
                </div>
            </q-card-section>
          </div>
        </div>

        <!-- Tache -->
        <div class="col-md-6  col-sm-6 col-xs-12 q-pa-sm" >
          <div class=" q-pa-md bg-teal-1 ">
            <q-card-section horizontal class="items-center">
                <div class="q-pr-md" >
                  <q-avatar color="teal-10" text-color="teal-1" icon="task_alt" size="lg" />
                </div>
                <div class="" > <span class="text-h5 text-weight-light">Tâches</span> <br> </div> 
                <q-space />
                <div class="q-ml-md text-center text-weight-bold" style="font-size: 40px"> 
                  <span>{{total.taches}}</span>
                </div>
            </q-card-section>
          </div>
        </div>

        <!-- fonctionnalités -->
        <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm" >
           <div class=" q-pa-md bg-teal-1 ">
            <q-card-section horizontal class="items-center">
                <div class="q-pr-md" >
                  <q-avatar color="teal-10" text-color="teal-1" icon="bookmark_added" size="lg" />
                </div>
                <div class="" > <span class="text-h5 text-weight-light">Sous Tâches</span> <br> </div> 
                <q-space />
                <div class="q-ml-md text-center text-weight-bold" style="font-size: 40px"> 
                  <span>{{total.sous_taches}}</span>
                </div>
            </q-card-section>
          </div>
           
        </div>

      </div>
    </div>
    <!-- statistique d'évolution des 5 dernières jour -->
    <div v-if="total.missions > 0" class="q-pa-md">
      <h4>Évolution des 5 derniers jours</h4>
      <div class="flex justify-between " >
        <div v-for="item in evaluation" :key="'evaluation-item'.concat(item.options.labels[0])">
          <apexchart 
            
           width="100%"
           height="350"
          type="line"
          :options="item.options"
          :series="item.series"
          />
        </div>

      </div>
    </div>

  
    <!-- progressions des missions -->
    <div v-if="progression.length > 0" >
      <h4>Progression des missions en cours</h4>
      <div class="flex justify-between" >
        <div v-for="item in progression" :key="'progression-item'.concat(item.options.labels[0])" class="" >
            <apexchart 
          type="donut" 
          width="300" 
          :options="item.options" 
          :series="item.series" 
          />
        </div>
      </div>
    </div>

   
  </q-page>
</template>

<script>
import qs from "qs";
import fr from "apexcharts/dist/locales/fr.json";
import { format } from "date-fns";
import { fr as dfns_fr } from "date-fns/locale";
import { useQuasar } from 'quasar'
import { defineComponent, onMounted, getCurrentInstance, ref, onBeforeMount } from "vue";
export default defineComponent({
  
  async beforeMount(){

    const $q = useQuasar()
    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')

    if (token) {
    
        try {
        $q.loading.show()
        //let token = this.$sdata.value.auth.jwt
        //let user = this.$sdata.value.auth.user
        // -> total
        // mission
        
        let res = await this.$api({
          url:"/missions/count",
          method: "get",
          headers:{
            Authorization: `Bearer ${token}`
          },
          params: {
            'organisation.id': user.organisations[0].id,
            'categorie_mission.titre': user.categorie_mission.titre
          }
        })
        this.$data.total.missions = res.data
        
        // fonctionnalités
        res = await this.$api({
          url:"/fonctionnalites/count",
          method: "get",
          headers:{
            Authorization: `Bearer ${token}`
          },
          params: {
            'mission.organisation.id': user.organisations[0].id,
            'mission.categorie_mission.titre': user.categorie_mission.titre
          }
        })
        this.$data.total.fonctionnalites = res.data

        // taches
        res = await this.$api({
          url:"/taches/count",
          method: "get",
          headers:{
            Authorization: `Bearer ${token}`
          },
          params: {
            'fonctionnalite.mission.organisation.id': user.organisations[0].id,
            'fonctionnalite.mission.categorie_mission.titre': user.categorie_mission.titre
          }
        })
        this.$data.total.taches = res.data

        // fonctionnalités
        res = await this.$api({
          url:"/sous-taches/count",
          method: "get",
          headers:{
            Authorization: `Bearer ${token}`
          },
          params: {
            'tache.fonctionnalite.mission.organisation.id': user.organisations[0].id,
            'tache.fonctionnalite.mission.categorie_mission.titre': user.categorie_mission.titre
          }
        })
        this.$data.total.sous_taches = res.data

        // -> progression
        let params = qs.stringify({
          _where: {
            'organisation.id': user.organisations[0].id,
            'categorie_mission.titre': user.categorie_mission.titre
          },
          _start: 0,
          _limit: 3,
          _sort: 'createdAt:DESC'
        })

        res = await this.$api({
          url:`/missions?${params}`,
          method: "get",
          headers:{
            Authorization: `Bearer ${token}`
          },
        })

        let missions = res.data

        for (const item of res.data) {
          this.$data.progression.push({
            series:[item.progression, 100 - item.progression],
            options:{
              title:{text:item.titre},
              theme: {
              
                monochrome: {
                    enabled: true,
                    color:'#004d40',
                    shadeTo: 'light',
                    shadeIntensity: 0.99
                }
                  },
              chart:{
                locales:[fr],
                defaultLocale:'fr'
              },
              noData:{
                text:"Aucune donnée"
              },
              plotOptions:{
                pie:{
                  customScale: 1
                }
              },
              labels:["achevé", "reste"]
            }
          })
        }    


        for (const mission of missions) {
          // -> evaluation
          // -> progression
          params = qs.stringify({
            _where: {
              'mission.id': mission.id
            },
            _start: 0,
            _limit: 5,
            _sort: 'createdAt:DESC'
          })

          res = await this.$api({
            url:`/historique-missions?${params}`,
            method: "get",
            headers:{
              Authorization: `Bearer ${token}`
            },
          })

          let item_data = []
          let item_labels = []
          for (const item of res.data) {
            item_data.push(item.pourcentage)
            item_labels.push(
              format(
                new Date(item.createdAt), 
                'EEEE dd MMMM yyyy',
                {locale: dfns_fr}
              )
            )
          }
          this.$data.evaluation.push({
              series:[{
                name: "progression",
                data:item_data
              }],
              options:{
                title:{text:mission.titre},
                theme: {
                    palette: 'palette5'
                  },
                noData:{
                  text:"Aucune donnée"
                },
                chart:{
                  locales:[fr],
                  defaultLocale:'fr'
                },
                plotOptions:{
                  pie:{
                    customScale: 1
                  }
                },
                labels:item_labels
              }
            })
        }
        $q.loading.hide()
        //.log(this.$data.evaluation);
        
        /**
         {
          series:[{
            data:[10,5,30,10,15]
          }],
          options:{
            title:{text:"Titre"},
            noData:{
              text:"Aucune donnée"
            },
            chart:{
              locales:[fr],
              defaultLocale:'fr'
            },
            plotOptions:{
              pie:{
                customScale: 1
              }
            },
            labels:["lundi", "mardi", "mercredi","jeudi", "vendredi"]
          }
        }
        */
     
      } catch (error) {
        console.log(error);
      }
    }
  },
  
  data(){
    return {
      total:{
        missions: 0,
        fonctionnalites: 0,
        taches: 0,
        sous_taches: 0
      },
      progression:[],
      evaluation:[],
    }
  }
})
</script>
<style lang="sass" scoped>
.costumer-card
  border-radius: 0.5rem
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%)
.demo-title
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 1
  -webkit-box-orient: vertical
  text-align: justify
</style>
