<template>
    <q-item-section>
        <div>
            <span class="text-h5 q-mr-sm">{{dev.nom}}</span>  <span class="text-h6">{{dev.prenom}}</span>
        </div>
    </q-item-section>
    <q-item-section avatar></q-item-section>
    <q-item-section>
        <div class="text-primary" v-if="dev.statut" >
            <q-icon name="verified" size="sm"/> Verifier 
        </div>
        <div class="text-orange" v-else>
             <q-circular-progress indeterminate size="sm"/> En attente 
        </div>
    </q-item-section>
    <q-item-section class="text-center">
        <div class="q-gutter-xs" v-if="!dev.statut">
            <q-btn  icon="thumb_up_off_alt" flat color="green-14" @click="onValid" />
        </div>
    </q-item-section>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, getCurrentInstance, onMounted, defineComponent, inject, provide} from "vue";

export default defineComponent({
    props: {
    dev: {
      //type: Object,
      default() {
        return {};
      },
    },
  },
   setup(props) {
    const $q = useQuasar()
    const instance = getCurrentInstance();
    let dev = ref({})
    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')


    onMounted (async ()=>{
         dev.value = props.dev
         //console.log(' user |', user.categorie_mission._id)
    })
    
    let onValid = async () =>{
        console.log('ops.dev |', props.dev)
        props.dev.statut = true
        let ras = await instance.appContext.app.config.globalProperties.$api({
                url: `/users/${props.dev.id}`,
                method: 'put',
                data: props.dev,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })  
    }
    return{
        onValid,
        dev
    }
   }
})
</script>

<style>

</style>