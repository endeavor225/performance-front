<template>
    <h4>Équipes</h4>
    <q-list >
        <q-card-section  class="q-py-none  ">
            <q-item class="bg-primary text-white">
                <q-item-section >
                    <span class="text-h6">Noms Complets</span>  
                </q-item-section>
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                    <span class="text-h6">Status </span>  
                </q-item-section>
                <q-item-section class="text-center">
                    <span class="text-h6">Action</span>  
                </q-item-section>
            </q-item>
            <q-item  v-for="i in items" :key="i"  clickable v-ripple>
                <item :dev="i"/>
            </q-item>
        </q-card-section>
        <q-card-section>
        </q-card-section>
    </q-list>
</template>

<script>
import qs from "qs";
import { useQuasar } from 'quasar'
import {useRouter} from "vue-router"
import { defineComponent, onMounted, getCurrentInstance, ref, onBeforeMount } from "vue";
import Item from "../components/Team/item.vue";
export default defineComponent({
  components: {
    Item,
    },
  setup() {
    const $q = useQuasar()
    const instance = getCurrentInstance();
    const router = useRouter();
    const items = ref([]);
    const filter = ref("");
    const loading = ref(false);
    // const service = "missions";
    const showCreate = ref(false);
    const query = ref({
      _where: {},
    });
    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')

    onBeforeMount(() => {
      if (token === null) {
        router.push('/')
      }
    })
     
    onMounted(async () => {
      /*
      * Recuper la liste des utilisateurs  
      */ 
        if (token) {
          query.value._where = {
          "categorie_mission._id": user.categorie_mission.id,
        };
        //query.value._limit = pagination.value.rowsPerPage
        let params = qs.stringify(query.value);
        let res = await instance.appContext.app.config.globalProperties.$api({
              url: `/users?${params}`,
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            toolbar.value = true
            items.value = res.data
          //console.log("mesDev | ", res.data)
          // console.log('id | func toolbar | ', id)
        }
       
    });

    return {
       items
    };
  },
});
</script>