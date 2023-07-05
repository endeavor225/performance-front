<template>
  <q-card-section class="bg-primary">
    <div class="text-h5 text-weight-light text-white text-center">Liste membre(s)</div>
  </q-card-section>
  <q-card-section>

  <q-list v-for="itemDataUser in datasUsers" :key="itemDataUser">
    <q-item >
      <q-item-section avatar>
        <q-avatar square>
          <q-img src="man.png" ratio="1" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="h5 text-weight-medium text-teal-10" style="font-size: 25px">
          <span class="text-capitalize">{{itemDataUser.username}}</span>

          </q-item-label>
        <q-item-label caption >
          {{itemDataUser.role.name}}
        </q-item-label>
      </q-item-section>
    </q-item>
  
  </q-list>
  </q-card-section>
</template>

<script>
import qs from "qs";
import { ref, onMounted, getCurrentInstance } from "vue";
import { useQuasar } from 'quasar'
export default {
  props: {
    itemDeveloppeur: {
      //type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const $q = useQuasar()
    let datasUsers = ref();
    const instance = getCurrentInstance();
    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')

    

    onMounted(async () => {
      const query = ref({
        _where: {},
      });
    
       

      query.value._where = {
        "id" : props.itemDeveloppeur
      };

      let res = await instance.appContext.app.config.globalProperties.$api({
        url: `/missions/${props.itemDeveloppeur}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      datasUsers.value = res.data.users
    });

    return {
      datasUsers
    };
  },
};
</script>

<style lang="scss" scoped>
</style>