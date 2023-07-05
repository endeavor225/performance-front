<template>
  <q-page padding>
    <!-- content -->
    <div>
      username: {{$sdata.value.auth.user.username}}
    </div>
    <!--
    <div>
      <q-btn @click="$router.push('/reset-password')" label="changer le mot de passe" />
    </div>
    -->
  </q-page>
</template>

<script>
import { defineComponent} from "vue";
export default defineComponent({
  // name: 'PageName',
})
</script>
