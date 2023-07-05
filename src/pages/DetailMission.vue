<template>
  <q-page padding>
    <q-btn
     color="grey" 
      flat
      icon="reply"
      label="Retour"
      :to="{ name: 'recapulatif' }"
    />
    <div class="row justify-evenly q-mt-lg q-px-sm" >
      <div class="col-md-7 q-px-md" >
        <!-- style="border: 1px #1976D2 solid" -->
        <div class=" q-px-lg" style="border-radius: 5px">
          <div class="text-h5 text-weight-medium text-primary" style="margin: 30px 0px">
            Etat actuel de l'application
          </div>
          <q-linear-progress
            color="amber-13"
            :value="nbEncours + nbTerminee"
            track-color="teal-1"
            rounded
            size="8px"
            class="q-my-lg"
          >
            <!-- :value="nbEncours + nbTerminee" -->
            <div class="absolute-full flex">
              <q-linear-progress
                :value="nbTerminee"
                :buffer="0"
                color="green-13"
                track-color=""
                size="100%"
                class="no-border-radius"
              />
            </div>
          </q-linear-progress>

          <!-- <q-linear-progress buffer="0.6" value="0.5" rounded color="purple" track-color="orange" class="q-mt-sm" /> -->
          <div class="row justify-evenly" style="margin: 50px 20px">
            <div class="col-4">
              <span v-if="nbTerminee">
                <q-badge color="green-13" rounded class="q-mr-sm" /><span>{{
                  Math.round(nbTerminee * 100)
                }}</span
                >%  terminée(s)
              </span>
              <span v-else>
                <q-badge color="green-13" rounded class="q-mr-sm" /><span> 0</span
                >%  terminée(s)
              </span>
            </div>
            <div class="col-4">
              <span v-if="nbEncours">
                <q-badge color="amber-13" rounded class="q-mr-sm" /><span>{{
                  Math.round(nbEncours * 100)
                }}</span
                >%  en cours
              </span>
              <span v-else>
                <q-badge color="amber-13" rounded class="q-mr-sm" /><span> 0</span
                >%  en cours
              </span>
            </div>
            <div class="col-4">
              <span v-if="nbNondemarree" class="text-center">
                <q-badge color="green-3" rounded class="q-mr-sm" /><span>{{
                  Math.round(nbNondemarree * 100)
                }}</span
                >%  Non démarée(s)
              </span>
              <span v-else class="text-center">
                <q-badge color="green-3" rounded class="q-mr-sm" /><span> 0</span>%
                 Non debutée(s)
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
      </div>
      <div class="col-sm-12 col-lg-5 col-md-5 q-pl-md">
        <div
          class="col-4 bg-teal-1"
  
        >
          <div class="row items-center">
            <div class="col-7 q-px-sm ">
              <div class="text-h5  text-teal-10 q-mb-sm text-uppercase">
                {{ titreMission }}
              </div>

              <div class="text-h6 text-teal-10 text-weight-light">Finit {{ dateResult }}</div>
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
    </div>
    <div class="row justify-center q-mt-md">
      <div class="col-12 q-px-sm">
        <q-card class="bg-teal-1" flat square>
          <q-card-section class="bg-primary">
            <div class="text-h5 text-weight-light text-teal-1">
              Carnet de route : Fonctionnalité(s)
            </div>
          </q-card-section>
          <q-card-section>  
                <graph />
            <q-item>
              <q-space />
              <q-item class="items-center">Fonctionnalité(s)</q-item>
              <q-item class="items-center bg-teal-10" style="border : solid black 1px;">
              <q-item-section  side top>
                <span class="text-teal-1" v-if="nbTerminee">
                  <q-badge color="green-13" rounded class="q-mr-sm" /><span>{{
                    Math.round(nbTerminee * 100)
                  }}</span 
                  >%terminée(s)
                </span>
                <span v-else class="text-teal-1">
                  <q-badge color="green-13" rounded class="q-mr-sm" /><span> 0</span
                  >%  terminée(s)
                </span>
              </q-item-section>
              <q-item-section  side top class="text-teal-1"> 
              <span v-if="nbEncours" >
                <q-badge color="amber-13" rounded class="q-mr-sm" /><span>{{
                  Math.round(nbEncours * 100)
                }}</span
                >%  en cours
              </span>
              <span v-else>
                <q-badge color="amber-13" rounded class="q-mr-sm" /><span> 0</span
                >%  en cours
              </span>
              </q-item-section>
              <q-item-section side top class="text-teal-1"> 
                <span v-if="nbNondemarree" class="text-center">
                  <q-badge color="grey" rounded class="q-mr-sm" /><span>{{
                    Math.round(nbNondemarree * 100)
                  }}</span
                  >%  Non démarée(s)
                </span>
                <span v-else class="text-center">
                  <q-badge color="grey" rounded class="q-mr-sm" /><span> 0</span>%
                  Non debutées
                </span>
              </q-item-section>
              </q-item>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-evenly q-mt-md" style="">
      <div class="col-8 q-px-sm">
      <q-card class="bg-teal-1" flat square>
        <q-card-section class="bg-primary">
          <div class="text-h5 text-weight-light text-teal-1">
            Liste des fonctionnalités et leur évolution
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
      </div>
      <div class="col-4 q-px-sm">
        <q-card class="bg-teal-1 my-card col-4" flat square style="min-height:100%">
          <show-developpeur :itemDeveloppeur="fetchedId" />
        </q-card>
      </div>
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
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuasar } from 'quasar'
import { defineComponent, ref, onMounted, getCurrentInstance, onBeforeMount, provide} from "vue";
import { useRoute } from "vue-router";
import ShowFonctionnalite from "components/Mission/itemFonctionnalite.vue";
import ShowDeveloppeur from "components/Mission/itemDeveloppeur.vue";
import Graph from "src/components/Mission/Graph.vue";

export default defineComponent({
  components: {
    ShowFonctionnalite,
    ShowDeveloppeur,
    Graph,
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
    const route = useRoute();
    let confirm = ref(false);
    const instance = getCurrentInstance();
    let nbTerminee = ref();
    let nbEncours = ref();
    let nbNondemarree = ref();
    let total = ref();
    let titreMission = ref();
    let detailMission = ref([]);
    let dateResult = ref();
    let developper = ref();
    let fetchedId = ref();
    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')

    fetchedId.value = instance.appContext.app.config.globalProperties.$missionId ;
    // provide('detailMission', detailMission)
    onBeforeMount(() => {
      if (token === null) {
        route.push('/')
      }
    })
            // console.log('detailMission | Avant', detailMission)
    onMounted(async () => {
     if (token) {
        const query = ref({
          _where: {},
          _sort : {}
        });

        let id = fetchedId.value;

        query.value._where = {
          id: id,
        };

        let params = qs.stringify(query.value);

        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/missions/?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        titreMission.value = res.data[0].titre
        let getDate = res.data[0].fin;

        dateResult.value = formatDistanceToNow(new Date(getDate), {
          addSuffix: true,
          locale: fr,
        });

        //total
        query.value._where = {
          mission: id,
        };
        query.value._sort = 'debut:ASC'
         

        params = qs.stringify(query.value);
        res = await instance.appContext.app.config.globalProperties.$api({
          url: `/fonctionnalites?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        detailMission.value = res.data;
        // instance.appContext.app.config.globalProperties.$detailMission  = res.data
        //     console.log('detailMission | Pendant', instance.appContext.app.config.globalProperties.$detailMission )
        total.value = res.data.length;
        //terminer
        query.value._where = {
          mission: id,
          progression: 100,
        };

        params = qs.stringify(query.value);
        res = await instance.appContext.app.config.globalProperties.$api({
          url: `/fonctionnalites/count?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(res.data !== 0){
          nbTerminee.value = res.data / total.value;
        }else{
          nbTerminee.value = 0
        }
        //non demarrer
        query.value._where = {
          mission: id,
          progression: 0,
        };

        params = qs.stringify(query.value);
        res = await instance.appContext.app.config.globalProperties.$api({
          url: `/fonctionnalites/count?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(res.data !== 0){
        nbNondemarree.value = res.data / total.value;
        }else{
          nbNondemarree.value = 0
        }
        //en cours
        query.value._where = {
          mission: id,
          progression_gt: 0,
          progression_lt: 100,
        };

        params = qs.stringify(query.value);
        res = await instance.appContext.app.config.globalProperties.$api({
          url: `/fonctionnalites/count?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(res.data !== 0){
          nbEncours.value = res.data / total.value;
        }else{
          nbEncours.value = 0
        }

      } 
    });

    provide('detailMission', detailMission)
    let onShowtask = () => {
      confirm.value = true;
    };
            // console.log('detailMission | Après', detailMission)
    return {
      color1: "positive",
      color2: "warning",
      confirm,
      onShowtask,
      nbTerminee,
      nbEncours,
      nbNondemarree,
      total,
      titreMission,
      detailMission,
      dateResult,
      developper,
      fetchedId,
    };
  },
});
</script>

<style lang="scss" scoped></style>
