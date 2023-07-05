<template>
     <div>
      <q-input
      
        bottom-slots
        :label="$t('search')"
        class="q-pa-sm"
        outlined
        v-model="search"
      
      >
        <template v-slot:append>
          <q-icon
           v-if="search !== ''"
            name="close"
            @click="search = ''"
            class="cursor-pointer"
          />
          <q-icon name="recherche" />
        </template>
      </q-input>
    </div>
</template>


<script>
import {
  defineComponent,watch,ref,getCurrentInstance,inject} from "vue";
  import { useQuasar } from 'quasar'
  export default defineComponent( {
  // name: 'ComponentName',

  setup () {
    const $q = useQuasar()
    self = getCurrentInstance();
    let service = "missions";
    let search = ref("");

    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')
     const query = ref({
      _where: {},
      _start: start,
      _limit: limit,
     
    });
    watch(search, async (newValue, oldValue) => {
      if (newValue.length !== 0) {
         
        let  params = qs.stringify(query.value);
      
      } else {
        
      }
        let  res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}?${params}`,
          headers: {
            Authorization: `Bearer ${token}`
             },

          });

          console.log('res.data',res.data);
    })

    return {
      search
    }
  }
})
</script>
