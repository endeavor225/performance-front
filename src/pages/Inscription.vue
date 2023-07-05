<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-around q-my-xl">
      <div
        class="bg-light-blue-1 col-7 rounded-borders q-my-lg"
        style="width: 50rem; border-radius: 20px"
      >
        <div class="text-center">
          <h5>
            <div>
              <q-icon color="primary" name="trending_up" size="2.2em" />
            </div>
            <span style="font-size: 35px" class="text-weight-bold text-primary">
              Inscription
            </span>
          </h5>
        </div>
        <div>
          <q-form ref="registerForm" @submit="onSubmit">
            <div class="row justify-evenly">
              <div class="col-5">
                <q-input
                  outlined
                  type="test"
                  label="Nom"
                  v-model="form.nom"
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'Le nom d\'utilisateur est obligatoire',
                  ]"
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  type="test"
                  label="Prénom"
                  v-model="form.prenom"
                  lazy-rules
                  :rules="[
                    (val) =>
                      !!val || 'Le prénom d\'utilisateur est obligatoire',
                  ]"
                />
              </div>
            </div>

            <div class="row justify-between q-mx-lg">
              <div class="col-4">
                <q-input
                  outlined
                  type="email"
                  label="Email"
                  v-model="form.email"
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'L\'email d\'utilisateur est obligatoire',
                  ]"
                />
              </div>
              <div class="col-4">
                <q-input
                  outlined
                  type="test"
                  label="username"
                  v-model="form.username"
                  lazy-rules
                  :rules="[
                    (val) =>
                      !!val || 'Le username d\'utilisateur est obligatoire',
                  ]"
                />
              </div>
              <div class="col-3">
                <q-select
                  v-model="form.categorie_mission"
                  model-value=""
                  :options="optionsSelect"
                  option-value="id"
                  option-label="titre"
                  label="Choisir un departement"
                  outlined
                />
              </div>
            </div>

            <div class="row justify-around q-mx-lg">
              <div class="col-6 q-pr-xs">
                <q-input
                  outlined
                  :type="isPwd ? 'password' : 'text'"
                  label="Mot de passe"
                  v-model="form.password"
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'Le mot de passe est obligatoire',
                    (val) =>
                      val.length > 4 ||
                      'le mot de passe dois être supérieur à 4 carractères',
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
              </div>
              <div class="col-6 q-pl-sm">
                <q-input
                  outlined
                  :type="isPwdconfirm ? 'password' : 'text'"
                  label="Confirme mot de passe"
                  v-model="form.confirme_password"
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'Le mot de passe est obligatoire',
                    (val) =>
                      val.length > 4 ||
                      'le mot de passe dois être supérieur à 4 carractères',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwdconfirm ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwdconfirm = !isPwdconfirm"
                    />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row justify-center text-center q-my-lg">
              <div class="col-5">
                <q-btn
                  outline
                  type="submit"
                  color="primary"
                  class="q-my-lg full-width"
                  label="S'inscrire"
                  :loading="submitting"
                />
                <span class="text-grey-8"> Si vous avez déja un compte ? </span>
                <router-link
                  :to="{ name: 'Login' }"
                  class="text-primary text-italic"
                  style="font-size: 16px"
                  >ici</router-link
                >
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, getCurrentInstance, onMounted } from "vue";
import { Notify } from "quasar";
import axios from "src/boot/axios";
export default defineComponent({
  setup(props, context) {
    const instance = getCurrentInstance();

    let form = ref({});
    let registerForm = ref();
    let isPwd = ref(true);
    let optionsSelect = ref([]);
    let isPwdconfirm = ref(true);
    let submitting = ref(false);

    onMounted(async () => {
      let res = await instance.appContext.app.config.globalProperties.$api({
        url: "/categorie-missions",
        methode: "get",
      });
      optionsSelect.value = res.data;
    });

    const onSubmit = async () => {
      if (registerForm.value.validate()) {
        if (form.value.password === form.value.confirme_password) {
          try {
            let res = await instance.appContext.app.config.globalProperties.$axios({
                url: "http://localhost:1337/auth/local/register",
                method: "post",
                data: form.value,
              });

            Notify.create({
              type: "positive",
              position: "top-right",
              timeout: 2500,
              message: "Vous êtes bien inscrit",
            });
            registerForm.value.$router.push("/attente");
          } catch (error) {
            console.log(error);
            Notify.create({
              type: "negative",
              position: "top-right",
              timeout: 2500,
              message: "Inscription échouée",
            });
          }
        } else {
          Notify.create({
            type: "negative",
            position: "top-right",
            timeout: 2500,
            message: "Mot de passe non identiques",
          });
        }
      }
    };

    return {
      form,
      registerForm,
      isPwd,
      isPwdconfirm,
      submitting,
      optionsSelect,
      onSubmit,
    };
  },
});
</script>
