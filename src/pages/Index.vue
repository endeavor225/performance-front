<template>

  <q-page padding>
    <!-- content -->
      <div class="row justify-between  q-ml-sm" style="margin-top:8px">
        <div class="col-8">
          <div class="text-h4 q-mb-sm q-mt-md"> Liste des Missions s</div>
        </div>

        <div class="col-2 ">
          <q-input
            bottom-slots
            class="q-px-md q-py-xs shadow-4"
            borderless
            dense
            v-model="search"
            placeholder="Recherche"
            style="border-radius:5px"
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

          <div class="q-mt-sm text-right">
             <q-select
                style="width:15rem"
                v-model="model"
                :options="options"
                dropdown-icon="sort" 
                borderless
              >  
                <template v-slot:selected > 
                  Trier par :
                  <q-chip
                    v-if="model"
                    dense
                    square
                    color="white"
                    text-color="primary"
                    class="q-my-none q-ml-xs q-mr-none"
                    size="1rem"
                  >
                    <q-avatar size="2.5rem" :icon="model.icon" />
                    {{ model.label }}
                  </q-chip>
                </template> 
              </q-select>
            </div>
        </div>
      </div>
        <div class="row">
          <!-- component  de la liste des Missions-->
          <liste-mission
            v-for="item in items"
            :key="item.id"
            :itemListe="item"
          />
          
        </div>
        <div class="q-pa-lg flex justify-end">
        <q-pagination
         v-model="current"
            :max="maxitems"
            direction-links
            active-color="primary"
        >
        </q-pagination>
      </div>
   
  </q-page>

</template>

<script>
import qs from "qs";
import lodash from "lodash";
import { defineComponent, onMounted, getCurrentInstance, ref, watch } from "vue";
import ListeMission from "components/Mission/Item.vue";

export default defineComponent({
    components: {
    ListeMission,
    },
  setup() {
    const instance = getCurrentInstance();
    const items = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const service = "missions";
    const  current= ref(1)
    const maxitems = ref(1)
    var search = ref("");
    var start = 0;
    var limit = 5;
    let model = ref();
    const query = ref({
      _where: {},
      _start: start,
      _limit: limit,
     
    });

    onMounted(async () => {
      //await findItems()

      let token = instance.appContext.app.config.globalProperties.$sdata.value.auth.jwt
      let user = instance.appContext.app.config.globalProperties.$sdata.value.auth.user
       query.value._where = {
          "organisation.id": user.organisations.length > 0 ? user.organisations[0].id : "",
        };
        //query.value._limit = pagination.value.rowsPerPage
        let params = qs.stringify(query.value);

        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

         items.value = res.data
         let nb = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/count?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        maxitems.value= Math.ceil(nb.data / limit)
        //console.log('total',maxitems.value);
    });

    watch(current, async (newValue, oldValue) => {
      let token = instance.appContext.app.config.globalProperties.$sdata.value.auth.jwt
      let user = instance.appContext.app.config.globalProperties.$sdata.value.auth.user
      console.log('limit',limit);
          query.value = {
            _where:{
              "organisation.id": user.organisations.length > 0 ? user.organisations[0].id : "",
            },
           _start:(newValue - 1) * limit,
           _limit:limit
          
           };
         let  params = qs.stringify(query.value);
         let  res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },

          });

          console.log('res.data',res.data);
           items.value = res.data
              
     });

    watch(search, async (newValue, oldValue) => {
        let token = instance.appContext.app.config.globalProperties.$sdata.value.auth.jwt
        let user = instance.appContext.app.config.globalProperties.$sdata.value.auth.user
      if (newValue.length !== 0) {
           query.value._where ={
              "organisation.id": user.organisations.length > 0 ? user.organisations[0].id : "",
              titre_contains:newValue

           }
           console.log('query.value',query.value);
      
      } else {

      query.value._where = {
          "organisation.id": user.organisations.length > 0 ? user.organisations[0].id : "",
        }  
      }

      let  params = qs.stringify(query.value);
      let  res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },

          });
           items.value = res.data

        let nb = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/count?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        maxitems.value= Math.ceil(nb.data / limit)
        console.log('total',maxitems.value);   
    })

    watch(model, async (newValue, oldValue) => {
        let token = instance.appContext.app.config.globalProperties.$sdata.value.auth.jwt
        let user = instance.appContext.app.config.globalProperties.$sdata.value.auth.user
      //console.log(model.value);
      if (model.value.label === "Date") {
        console.log("date");
           query.value = {
             _where: {
              "organisation.id": user.organisations.length > 0 ? user.organisations[0].id : "",
           },
           _sort: "createdAt:DESC"
          }
           //console.log('query.value',query.value);
      
      } else {
        query.value._where = {
          "organisation.id": user.organisations.length > 0 ? user.organisations[0].id : "",
        }  
      }

      let  params = qs.stringify(query.value);
      let  res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },

          });
          
          items.value = res.data

        let nb = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/count?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        maxitems.value= Math.ceil(nb.data / limit)
        console.log('total',maxitems.value);   
    })
    return {
      items,
      current,
      maxitems,
      search,
      model,
      options: [
        {
          label: "Fonctionality",
          value: "fonction",
          icon: "assignment",
         
        },
        {
          label: "Date",
          value: "date",
          icon: "event",
         
        },
        {
          label: "Developpeur",
          value: "dev",
          icon: "person",
         
        },
      ],
    };
  }
});
</script>
