<template>
  <q-page padding>
          <q-btn icon="close" flat round dense v-close-popup class="float-right	" size="1rem" color="negative"/>
    <div class="row justify-evenly q-mt-lg">
        
      <div class="col-7 shadow-6 q-px-lg q-mr-lg" style="border-radius: 5px">
        <div class="text-h5 text-weight-medium" style="margin: 30px 0px">
          Etat actuel de l'application
          
        </div>    
        <q-linear-progress color="warning" :value="nbEncours + nbTerminee"   track-color="grey" rounded size="8px" class="q-my-lg">
          <div class="absolute-full flex ">
            <q-linear-progress
               :value="nbTerminee"
               :buffer=0
              color="positive" 
              track-color="amber-14"
              size="100%"
              class="no-border-radius"
            />
          </div>
        </q-linear-progress>
          
        
        <!-- <q-linear-progress buffer="0.6" value="0.5" rounded color="purple" track-color="orange" class="q-mt-sm" /> -->
        <div class="row justify-evenly" style="margin: 50px 20px">
          <div class="col-4"  >
            <span v-if="nbTerminee">
              <q-badge color="positive" rounded class="q-mr-sm" /><span >{{ Math.round(nbTerminee * 100)}}</span>% Fonctionnalités terminée
            </span>
            <span v-else>
              <q-badge color="positive" rounded class="q-mr-sm" /><span > 0</span>% Fonctionnalités terminée
            </span>
          </div>
          <div class="col-4"  >
            <span v-if="nbEncours">
              <q-badge color="warning" rounded class="q-mr-sm" /><span >{{ Math.round(nbEncours * 100)}}</span>% Fonctionnalités en cours
            </span>
            <span v-else>
              <q-badge color="warning" rounded class="q-mr-sm" /><span > 0</span>% Fonctionnalités en cours
            </span>
          </div>
           <div class="col-4"  >
            <span v-if="nbNondemarree" class="text-center	">
              <q-badge color="grey" rounded class="q-mr-sm" /><span >{{ Math.round(nbNondemarree * 100)}}</span>% Fonctionnalités Non démarées
            </span>
            <span v-else class="text-center	">
              <q-badge color="grey" rounded class="q-mr-sm" /><span > 0</span>% Fonctionnalités Non debutées
            </span>
          </div>
          <!-- <div class="col-4" >
            <q-badge color="warning" rounded class="q-mr-sm" /><span v-if="nbTerminee ? nbTerminee : nbTerminee == 0">{{ Math.round(nbTerminee * 100)}}</span>% Fonctionnalités
            en cours
          </div>
           <div class="col-4" >
            <q-badge color="warning" rounded class="q-mr-sm" /><span v-if="nbEncours ? nbEncours : nbEncours == 0">{{ Math.round(nbEncours * 100)}}</span>% Fonctionnalités
            en cours
          </div>
          <div class="col-4" >
            <q-badge color="grey" rounded class="q-mr-sm" /><span v-if="nbNondemarree ? nbNondemarree :nbNondemarree == 0">{{ Math.round(nbNondemarree * 100)}}</span>% Fonctionnalités non
            demarrée
          </div> -->
        </div>
      </div>
      <div
        class="col-4 shadow-6"
        style="border-radius: 5px; background: #a7caec"
      >
        <div class="row">
          <div class="col-7" style="padding: 60px 0px 0px 16px">
            <div class="text-h5 q-mb-sm text-uppercase">{{itemDetailMission.titre}}</div>
             
            <div class="text-uppercase">Finis {{dateResult}}</div>
          </div>
          <div class="col-5">
            <q-img
              src="App development-rafiki.png"
              width="100%"
              fit="cover"
              class="float-right"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-evenly" style="margin-top: 5vh">
      <q-card class="col-8 q-mr-lg">
        <q-card-section class="bg-blue-grey-1">
          <div class="text-h5 text-weight-regular">
            Liste des fonctionnalités et leur évolutions
          </div>
        </q-card-section>
        <q-list class="vertical-middle" bordered separator>
          <div>
            <show-fonctionnalite
              v-for="itemFonctionnalite in detailMission"
              :key="itemFonctionnalite.id"
              :itemDetailFonctionnalite="itemFonctionnalite"
            /> 
           
          </div>
        </q-list>
      </q-card>
      <q-card class="my-card col-3">
       <show-developpeur :itemDeveloppeur="itemDetailMission.users"/>
      </q-card>
    </div>
    <!-- <q-dialog
      transition-hide="jump-up"
      transition-show="jump-down"
      v-model="confirm"
    >
       <show-tache :itemTache="fonctionnalites"/> 
    </q-dialog> -->
  </q-page>

</template>

<script>
import qs from "qs";
import {formatDistanceToNow} from 'date-fns'
import { fr } from 'date-fns/locale'
import { defineComponent, ref, onMounted, getCurrentInstance } from "vue";
import ShowFonctionnalite from "components/Mission/itemFonctionnalite.vue";
import ShowDeveloppeur from 'components/Mission/itemDeveloppeur.vue'
import { useQuasar } from 'quasar'
export default defineComponent({
  components: {
    ShowFonctionnalite,
    ShowDeveloppeur
  },
  props: {
    itemDetailMission: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  setup(props) {
    const $q = useQuasar()
    let confirm = ref(false);
    const instance = getCurrentInstance();
    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')

    let nbTerminee = ref()
    let nbEncours = ref()
    let nbNondemarree = ref()
    let total = ref()
    let detailMission = ref([]);
    let dateResult = ref();
     dateResult = formatDistanceToNow(new Date(props.itemDetailMission.fin),{
       addSuffix:true,
       locale:fr
     })

    onMounted(async () => {
      const query = ref({
        _where: {},
      });

      let id = props.itemDetailMission.id

       //total
      query.value._where = {
        "mission": id,
      };

      let params = qs.stringify(query.value);
      let res = await instance.appContext.app.config.globalProperties.$api({
        url: `/fonctionnalites?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      detailMission.value = res.data
      console.log("detaimMission",detailMission.value );

      total.value = res.data.length
      
      //terminer
      query.value._where = {
        "mission": id,
        "progression": 100
      };

        params = qs.stringify(query.value);
       res = await instance.appContext.app.config.globalProperties.$api({
        url: `/fonctionnalites/count?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      nbTerminee.value = res.data / total.value
     

      //non demarrer
      query.value._where = {
        "mission": id,
        "progression": 0
      };

      params = qs.stringify(query.value);
        res = await instance.appContext.app.config.globalProperties.$api({
        url: `/fonctionnalites/count?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      nbNondemarree.value = res.data / total.value



      //en cours
      query.value._where = {
        "mission": id,
        "progression_gt": 0,
        "progression_lt": 100
      };

      params = qs.stringify(query.value);
 
     
      res = await instance.appContext.app.config.globalProperties.$api({
        url: `/fonctionnalites/count?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      nbEncours.value = res.data / total.value

     
    })
    let onShowtask = () => {
      confirm.value = true;
    };

    return {
      color1: "positive",
      color2: "warning",
      confirm,
      onShowtask,
      nbTerminee,
      nbEncours,
      nbNondemarree,
      total,
      detailMission,
      dateResult
    };
  },
});
</script>

<style lang="scss" scoped>
</style>