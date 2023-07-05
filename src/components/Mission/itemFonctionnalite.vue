<template>
  
    <q-item class="q-py-lg text-teal-10" clickable v-ripple @click="onClick">
      <q-item-section>
        <span class="text-h5 text-capitalize"> {{ itemDetailFonctionnalite.titre }} </span>
      </q-item-section>
      <q-item-section>
        <div>
          <q-chip dense color="grey-10" text-color="grey-1" class="text-weight-light q-px-sm">
            {{ itemDetailFonctionnalite.taches.length }} tache(s)
          </q-chip>
        </div>
      </q-item-section>
      <q-item-section>
        <div>
          <q-chip dense color="grey-10" text-color="grey-1" class="text-weight-light q-px-sm"
            >{{nbSousTaches}} Sous-tache(s)</q-chip
          >
        </div>
      </q-item-section>
      <q-item-section class="">
         <q-linear-progress
                :value="itemDetailFonctionnalite.progression /100 < 0 ?  0 : itemDetailFonctionnalite.progression /100"
                rounded
                color="grey-10"
                track-color="grey-8"
                size="70%"
              />
              
      </q-item-section>
      <q-item-section class="">
        Finit {{dateResult}}
              
      </q-item-section>
    </q-item>
<!--     <q-dialog
      transition-hide="jump-up"
      transition-show="jump-down"
      v-model="confirm"
      
    >
    
     <q-card class="q-pa-md "  style="max-width:1500px; width:900px" >
        <q-btn icon="close" flat round dense v-close-popup class="float-right " size="1rem" color="negative"/>
      <tache :itemTache="itemDetailFonctionnalite.taches" /> 
      
      </q-card>
    </q-dialog> -->
    <q-dialog v-model="confirm">
      <q-card class="my-card" style="width: 70vw; max-width: 80vw; ">
        <tache :itemTache="itemDetailFonctionnalite.taches" />  
      </q-card>

      <!-- <q-carousel
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        v-model="slide"
        control-color="primary"
        navigation-icon="radio_button_unchecked"
        navigation
        padding
        height="70vh"
        class="bg-white shadow-1 rounded-borders"
        style="width: 100vw"
      >
        <q-carousel-slide :name="1" class="column no-wrap flex-center">
          <q-icon name="style" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="2" class="column no-wrap flex-center">
          <q-icon name="live_tv" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="3" class="column no-wrap flex-center">
          <q-icon name="layers" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="4" class="column no-wrap flex-center">
          <q-icon name="terrain" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
      </q-carousel> -->
    </q-dialog>
</template>

<script>
import qs from "qs";

import {formatDistanceToNow} from 'date-fns'
import { fr } from 'date-fns/locale'
import { defineComponent, ref, onMounted, getCurrentInstance } from "vue";
import tache from 'src/components/Mission/itemTache.vue'
import { useQuasar } from 'quasar'
export default defineComponent({
  props: {
    itemDetailFonctionnalite: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components:{
      tache
  },
  setup(props) {
    const $q = useQuasar()
    let confirm = ref(false) 
    let nbSousTaches = ref()
    const instance = getCurrentInstance();
    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')
     let dateResult = ref();
     dateResult = formatDistanceToNow(new Date(props.itemDetailFonctionnalite.fin),{
       addSuffix:true,
       locale:fr
     })
    

    onMounted(async () => {
      let id = props.itemDetailFonctionnalite.id;

      const query = ref({
        _where: {},
      });
      query.value._where = {
        "tache.fonctionnalite": id,
      };

      let params = qs.stringify(query.value);

      let res = await instance.appContext.app.config.globalProperties.$api({
        url: `/sous-taches/count?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        nbSousTaches.value = res.data

    });


    let onClick = () => {
        confirm.value = true
    }



    return {
        nbSousTaches,
        onClick,
        confirm,
         dateResult,
         slide: ref(1),
         lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!',
    };
  },
})
</script>

<style lang="scss" scoped>
</style>