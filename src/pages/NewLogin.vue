<template>
  <q-page padding>
    <!-- content -->
    <div style="margin-top: 80px;">

      <div class="q-pa-md flex justify-center">
        <div style="max-width: 90%; width: 450px;">
          <q-card class="shadow-20 q-pb-md">

            <div style="text-align: center; padding-top: 10px">
              <h5 class="text-primary q-mb-xs">
                <span style="font-size: 40px;">
                  CONNEXION
                </span>
              </h5>
            </div>
            
            <q-card-section>
              <q-form ref="loginForm" @submit="submit" class="q-ml-lg q-mr-lg">

                Nom d'utilisateur
                <q-input
                  outlined
                  type="test"
                  label="Nom d'utilisateur"
                  v-model="form.identifier"
                  lazy-rules
                  :rules="[ (val) => !!val || 'Le nom d\'utilisateur est obligatoire']"
                />

                Mot de passe
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
                >

                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>

                </q-input>
                
                <div style="text-align: center;">
                  <q-btn
                    type="submit"
                    class=" q-mt-xs full-width"
                    label="Se Connecter"
                    color="primary"
                    :loading="submitting"
                  />
                </div>
              </q-form>

              <div style="text-align: right" class="q-mr-lg q-mt-lg">
                  <a style="text-decoration: none; font-size: 18px" class="text-accent" href="#">Mot de passe oublié ? </a>
              </div>

            </q-card-section>
          </q-card>
        </div>
      </div>

    </div>
  </q-page>




   
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from "vue";

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
        } catch (error) {
          console.log(error.response);
          //console.log(error.response.data.message[0]);
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