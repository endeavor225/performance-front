<template>
  <div class="col-md-5 col-sm-5 col-lg-5 q-pa-sm">
        
    <q-card class="q-mt-md  no-border-radius no-box-shadow" style="border: 1px solid #54aaa5;" >
      <q-toolbar class="bg-primary text-white col-2">
        <q-toolbar-title>{{ itemMission.titre }}</q-toolbar-title>
      </q-toolbar>
      <q-card-section class="col-7">
        <q-card-section top>
        <span class="text-grey-7 q-ml-sm">Description</span>  
          <q-separator spaced size="0.1em" style="width: 70%" />
          <q-item-label caption class="ellipsis-3-lines">
            {{ itemMission.description }}</q-item-label
          >
        </q-card-section>
      </q-card-section>
      <q-card-section class="col q-px-xs">
        <div class="row">
          <q-item-section class="col">
            <q-chip size="sm" class="float-right">
              <q-avatar color="primary" text-color="white">
                {{itemMission.fonctionnalites.length}} 

              </q-avatar>
              <span class="ellipsis"> Fonctionnalité(s) </span>
            </q-chip>
          </q-item-section>
          <q-item-section class="col ellipsis">
            <q-chip size="sm" class="float-right">
              <q-avatar color="primary" text-color="white">
                {{taches.length}}</q-avatar>
              <span class="ellipsis"> Tâches(s) </span>
            </q-chip>
          </q-item-section>
          <q-item-section class="col ellipsis">
            <q-chip size="sm" class="float-right">
              <q-avatar color="primary" text-color="white">
                {{taches.sous_taches}}
                </q-avatar>
              <span class="ellipsis"> Sous-tâche(s) </span>
            </q-chip>
          </q-item-section>
          <q-item-section class="col-auto">
            <!-- <button @click="pageBlanc(itemMission);">Voir less</button> -->
            <q-btn unelevated color="primary" label="voir plus" @click="graph(itemMission.id)"/>
            <!-- <router-link :to="{name: 'detail_mission', params:{name:itemMission.id}}"  style="text-decoration:none;"></router-link> -->
            </q-item-section>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="visible" full-width>
    
      <q-card>
        <detail-mission :itemDetailMission="itemMission" />

      </q-card>
    
     
    </q-dialog>

  </div>
</template>

<script>
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import formatISO from "date-fns/fp/formatISO";
import qs from "qs";
import { useQuasar, SessionStorage} from 'quasar'
import { defineComponent, onMounted, getCurrentInstance, ref } from "vue";
import {useRouter,useRoute} from "vue-router"
import detailMission from "components/Mission/ShowdetailMission.vue";
export default defineComponent({
  // name: 'ComponentName',
  components: {
    detailMission
  },
  props: {
    itemMission: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const $q = useQuasar()
    let visible = ref(false);
    const route = useRoute(); 
    const router = useRouter();
    let fonctions = ref([]);
    let taches = ref([]);
    let sousTaches = ref([]);
    const instance = getCurrentInstance();
    
    const query = ref({
      _where: {},
      _start: 0,
      _sort: "id:DESC",
    });

    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')
    onMounted(async () => {
      query.value._where = {
        "mission": props.itemMission.id,
      };

      //console.log("item", props.itemMission.id);
      
      let params = qs.stringify(query.value);
      
      let res = await instance.appContext.app.config.globalProperties.$api({
        url: `/fonctionnalites?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fonctions.value = res.data;

      query.value._where = {
        "fonctionnalite.mission": props.itemMission.id,
      };
      params = qs.stringify(query.value);
      res = await instance.appContext.app.config.globalProperties.$api({
        url: `/taches?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      taches.value = res.data;

      query.value._where = {
        "tache.fonctionnalite.mission": props.itemMission.id,
      };
      params = qs.stringify(query.value);
      let lgSousTaches = res = await instance.appContext.app.config.globalProperties.$api({
        url: `/sous-taches/count?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      taches.value.sous_taches = lgSousTaches.data
    //   for (const key in fonctions.value) {
    //     if (Object.hasOwnProperty.call(fonctions.value, key)) {
    //       const element = fonctions.value[key];
    //       console.log("taches | ", element.titre);
    //       console.log("sous-tâches| ", element);
    //     }
    //   }
     });
    let graph = async (i)=>{
      query.value._where = {
          mission: i,
        };
        query.value._sort = 'debut:ASC'
         

        let params = qs.stringify(query.value);
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/fonctionnalites?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        detailMission.value = res.data;
        instance.appContext.app.config.globalProperties.$detailMission  = res.data
        instance.appContext.app.config.globalProperties.$missionId  = props.itemMission.id
            instance.appContext.app.config.globalProperties.$router.push("/detail_mission")
          SessionStorage.set('detailM', instance.appContext.app.config.globalProperties.$detailMission)

    }
    let onVisible = () => {
      visible.value = true

    }
    

  
    return {
      fonctions,
      taches,
      sousTaches,
      visible,
      onVisible,
      graph
      // pageBlanc
    };
  },
});
</script>
<style lang="sass" scoped>
.card-extra
  border-style: solid
  border-color: #1976D2
  border-width: 1px
</style>