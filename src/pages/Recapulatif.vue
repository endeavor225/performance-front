<template>
    <!-- content -->
      <div class="row justify-between  q-ml-sm" style="margin-top:-10px">
        <div class="col-8">
          <div class="text-h4 q-mb-sm q-mt-md"> Liste des Missions</div>
        </div>

        <div class="col-2 ">
          <q-input
            v-model="search"
            placeholder="Recherche"
            dense
            debounce="300"
          >
            <template v-slot:append>
              <q-icon
                v-if="search !== ''"
                name="close"
                @click="search = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
        <div class="row">
          <liste-mission
            v-for="mission in missions"
            :key="mission.id"
            :itemMission="mission"
          />
          
        </div>
        <div v-if="instanceItems === true && missions.length === 0" style="text-align: center">
          <p class="q-ma-lg text-h6 text-grey">Aucune mission trouvée</p>
        </div>
        
        <div class="q-pa-lg flex justify-end" v-if="missions.length !== 0">

        <q-pagination
         v-model="current"
            :max="maxitems"
            direction-links
            active-color="primary"
        >
        </q-pagination>
      </div>

      <q-ajax-bar
      ref="barAjax"
      position="top"
      color="accent"
      size="10px"
      skip-hijack
    />
   
</template>

<script>
import qs from "qs";
import { useQuasar } from 'quasar'
import {useRouter} from "vue-router"
import { defineComponent, onMounted, getCurrentInstance, ref, watch, onBeforeMount} from "vue";
import ListeMission from "components/Mission/ItemsMission.vue";

export default defineComponent({
  components: {
    ListeMission,
  },
  setup() {
    const instance = getCurrentInstance();
    const $q = useQuasar()
    const router = useRouter();
    const missions = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const service = "missions";
    const current = ref(1);
    const maxitems = ref(1);
    var search = ref("");
    var start = 0;
    var limit = 5;
    let fonctions = ref([]);
    const query = ref({
      _where: {},
      _start: start,
      _limit: limit,
    });
    const barAjax = ref(null)
    let instanceItems = ref(false);

    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')

    onBeforeMount(() => {
      if (token === null) {
        router.push('/')
      }
    })

    onMounted(async () => {
      if (token) {
        //await findItems()

        //Bar ajax de chargement
        const barRef = barAjax.value
        barRef.start()

        query.value._where = {
          "organisation.id":
            user.organisations.length > 0 ? user.organisations[0].id : "",
        };
        //query.value._limit = pagination.value.rowsPerPage
        let params = qs.stringify(query.value);

        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        missions.value = res.data;
        instanceItems.value = true

        let nb = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/count?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        maxitems.value = Math.ceil(nb.data / limit);
        //console.log('total',maxitems.value);
        //recupération de tache en fonction de la fonctionnalité
        
        let resFonction = await instance.appContext.app.config.globalProperties.$api({
          url: `/fonctionnalites`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        fonctions.value = resFonction.data;

        barRef.stop()
      }
    });

    watch(current, async (newValue, oldValue) => {

      console.log("limit", limit);
      query.value = {
        _where: {
          "organisation.id":
            user.organisations.length > 0 ? user.organisations[0].id : "",
        },
        _start: (newValue - 1) * limit,
        _limit: limit,
      };
      let params = qs.stringify(query.value);
      let res = await instance.appContext.app.config.globalProperties.$api({
        url: `/${service}?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      missions.value = res.data;
    });

    watch(search, async (newValue, oldValue) => {

      if (newValue.length !== 0) {
        query.value._where = {
          "organisation.id":
            user.organisations.length > 0 ? user.organisations[0].id : "",
          titre_contains: newValue,
        };
       
      } else {
        query.value._where = {
          "organisation.id":
            user.organisations.length > 0 ? user.organisations[0].id : "",
        };
      }

      let params = qs.stringify(query.value);
      let res = await instance.appContext.app.config.globalProperties.$api({
        url: `/${service}?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      missions.value = res.data;

      let nb = await instance.appContext.app.config.globalProperties.$api({
        url: `/${service}/count?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      maxitems.value = Math.ceil(nb.data / limit);
    });
    return {
      missions,
      current,
      maxitems,
      search,
      fonctions,
      barAjax,
      instanceItems,
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