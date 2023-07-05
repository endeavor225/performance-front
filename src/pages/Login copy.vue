<template>
  <q-page padding >
    <!-- content -->
  <!-- class="flex flex-center -->
  <div class="flex flex-center">
<img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
      style="width: 500px; height: 500px"
    >
  </div> 
    <div class="row justify-center" >
      <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5"  style="background-image: url(ConnexionId.png); background-repeat: no-repeat; background-size: 100% 100%; background-position: 50% 50%;">
          <!-- <img src="ConnexionId.png" alt=""> -->
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4  q-pa-lg" style="background-color: blue; border-radius: 0 15px 15px 0">
        <div class="text-center">
          <h5 class="text-white ">
            <div>
              <q-icon  name="trending_up" class="text-white" style="font-size: 2.2em;"/>
            </div>
            <span style="font-size: 35px;">
              <b>Connectez-vous</b>
            </span>
          
          </h5>
        </div>
        <div>
          <q-form ref="loginForm" @submit="submit" class="q-ml-lg q-mr-lg text-white">

            <b>Nom d'utilisateur</b>
            <q-input
              outlined
              type="test"
              label="Nom d'utilisateur"
              v-model="form.identifier"
              lazy-rules
              :rules="[ (val) => !!val || 'Le nom d\'utilisateur est obligatoire']"
              bg-color="white"
            />

            <b>Mot de passe</b>
            <q-input
              outlined
              :type="isPwd ? 'password' : 'text'" 
              label="Mot de passe"
              v-model="form.password"
              lazy-rules
              :rules="[ 
                (val) => !!val || 'Le mot de passe est obligatoire', 
                (val) => val.length > 3 || 'le mot de passe dois être supérieur à 4 carractères'
              ]"
              bg-color="white"
            >

              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>

            </q-input>
            
            <div style="text-align: center; margin-top: 25px">
              <q-btn
                outline
                type="submit"
                class=" q-mt-xs full-width"
                label="Se Connecter"
                color="white"
                :loading="submitting"
              />
            </div>
          </q-form>

          <div style="text-align: right" class="q-mr-lg q-mt-lg">
              <a style="text-decoration: none; font-size: 18px" class="text-white" href="#"><b>Mot de passe oublié ?</b> </a>
          </div>

        </div>
      </div>
    </div>
  
  </q-page>




   
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from "vue";
import { Notify } from 'quasar'
export default defineComponent({
  setup(props, context){
    const instance = getCurrentInstance()
    
    let form = ref({})
    let loginForm = ref()
    let isPwd = ref(true);
    let submitting = ref(false)

    let submit = async () => {
      //console.log(instance);
      if (loginForm.value.validate()) {
        submitting.value = true
        try {
         
          let res = await loginForm.value.$api.post("/auth/local", 
            form.value
          )
          let user = res.data
          loginForm.value.$sdata.value.auth = user
          //loginForm.value.$store.commit("auth/setAuth", user)
          submitting.value = false
          loginForm.value.$router.push("/dashboard")  
          Notify.create({
            type: 'positive',
            message: "Vous êtes connecté",
          })
        } catch (error) {
          console.log(error.response);
          //console.log(error.response.data.message[0]);
          submitting.value = false
          Notify.create({
            type: 'negative',
            message: "Nom d'utilisateur ou mot de passe incorrect",
          })
        }
        
        
      } else {
        console.log("non valide");
      }

      //console.log(form.value);
    }

    return {
      form,
      submit,
      loginForm,
      isPwd,
      submitting
    }
  }
})

</script>