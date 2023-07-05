<template>
  <!-- <q-page padding> -->
  <div padding>
    <div class="q-ma-md" style="margin-top: 8px">
      <div class="text-h4 q-mb-sm q-mt-md">Profil</div>
    </div>

    <div style="margin-top: 40px">
      <div class="q-pa-md flex justify-center">
        <div style="max-width: 90%; width: 700px">
          <q-card
            class="no-shadow bg-light-blue-1 q-pb-md"
            style="border-radius: 20px"
          >
            <div class="q-mt-md text-center" style="padding-top: 20px">
              <q-avatar round size="150px">
                <img
                  alt="logo-utilisateur"
                  src="img-3.jpg"
                  class="q-pa-xs bg-primary"
                />
              </q-avatar>
            </div>

            <div class="flex justify-center q-mt-lg q-ml-md q-mr-md">
              <div style="width: 100%">
                <q-slide-transition>
                  <div v-show="!expanded">
                    <div class="row">
                      <div class="col q-ma-sm">
                        <q-list>
                          <q-item
                            class=""
                            style="
                              border-radius: 5px;
                              border: 1px solid DarkGrey;
                            "
                          >
                            <q-item-section class="text-black">
                              
                              {{ user.nom }}
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                      <div class="col q-ma-sm">
                        <q-list>
                          <q-item
                            class=""
                            style="
                              border-radius: 5px;
                              border: 1px solid DarkGrey;
                            "
                          >
                            <q-item-section class="text-black">
                              {{ user.prenom }}
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col q-ma-sm">
                        <q-list>
                          <q-item
                            class=""
                            style="
                              border-radius: 5px;
                              border: 1px solid DarkGrey;
                            "
                          >
                            <q-item-section class="text-black">
                              {{ user.username }}
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                      <div class="col q-ma-sm">
                        <q-list>
                          <q-item
                            class=""
                            style="
                              border-radius: 5px;
                              border: 1px solid DarkGrey;
                            "
                          >
                            <q-item-section class="text-black">
                              {{ user.email }}
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>

                    <div style="text-align: center">
                      <q-btn
                        no-caps
                        color="primary"
                        label="Modifier"
                        @click="expanded = !expanded"
                        style="width: 200px"
                        class="q-mt-lg"
                      />
                    </div>
                  </div>
                </q-slide-transition>
              </div>
            </div>

            <div class="flex justify-center q-mt-lg q-ml-md q-mr-md">
              <div style="width: 100%">
                <q-slide-transition>
                  <div v-show="expanded">
                    <q-form @submit="onSubmit" ref="eForm">
                      <div class="row">
                        <div class="col q-ma-sm">
                          <q-input
                            v-model="formData.nom"
                            outlined
                            label="Nom"
                            lazy-rules
                            :rules="[
                              (val) => !!val || 'Le champ nom est obligatoire',
                              (val) =>
                                val.length > 3 ||
                                'ce champ doit contenir au moins 4 caractères',
                            ]"
                          />
                        </div>
                        <div class="col q-ma-sm">
                          <q-input
                            v-model="formData.prenom"
                            outlined
                            label="Prénom"
                            lazy-rules
                            :rules="[
                              (val) =>
                                !!val || 'Le champ Prénom est obligatoire',
                              (val) =>
                                val.length > 3 ||
                                'ce champ doit contenir au moins 4 caractères',
                            ]"
                          />
                        </div>
                      </div>

                      <div class="row">
                        <div class="col q-ma-sm">
                          <q-input
                            v-model="formData.username"
                            outlined
                            label="Username"
                            lazy-rules
                            :rules="[
                              (val) =>
                                !!val || 'Le champ username est obligatoire',
                              (val) =>
                                val.length > 3 ||
                                'ce champ doit contenir au moins 4 caractères',
                            ]"
                          />
                        </div>
                        <div class="col q-ma-sm">
                          <q-input
                            v-model="formData.email"
                            outlined
                            label="Email"
                            type="email"
                            lazy-rules
                            :rules="[
                              (val) =>
                                !!val || 'Le champ email est obligatoire',
                              (val) =>
                                val.length > 9 ||
                                'ce champ doit contenir au moins 10 caractères',
                            ]"
                          />
                        </div>
                      </div>

                      <div class="q-gutter-sm">
                        <q-checkbox
                          v-model="choix"
                          label="Changer de mot de passe !"
                        />
                      </div>
                      <!-- :rules="rules.password" -->
                      <q-slide-transition>
                        <div class="row" v-show="choix">
                          <div class="col q-ma-sm">
                            <q-input
                              outlined
                              :type="isPwd1 ? 'password' : 'text'"
                              v-model="password"
                              label="Nouveau mot de passe"
                              counter
                            >
                              <template v-slot:hint>
                                Nombre de caractère minimal (6)
                              </template>
                              <template v-slot:append>
                                <q-icon
                                  :name="
                                    isPwd1 ? 'visibility_off' : 'visibility'
                                  "
                                  class="cursor-pointer"
                                  @click="isPwd1 = !isPwd1"
                                />
                              </template>
                            </q-input>
                          </div>
                          <div class="col q-ma-sm">
                            <q-input
                              outlined
                              :type="isPwd1 ? 'password' : 'text'"
                              v-model="confirmation"
                              label="Comfirmation de mot de passe"
                              counter
                            >
                              <template v-slot:append>
                                <q-icon
                                  :name="
                                    isPwd1 ? 'visibility_off' : 'visibility'
                                  "
                                  class="cursor-pointer"
                                  @click="isPwd1 = !isPwd1"
                                />
                              </template>
                            </q-input>
                          </div>
                        </div>
                      </q-slide-transition>

                      <div style="text-align: center">
                        <q-btn
                          no-caps
                          color="primary"
                          label="Sauvegarder"
                          style="width: 200px"
                          class="q-mt-lg"
                          type="submit"
                          :loading="submitting"
                        >
                          <template v-slot:loading>
                            <q-spinner-facebook size="lg" />
                          </template>
                        </q-btn>
                      </div>
                    </q-form>
                  </div>
                </q-slide-transition>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
  <!-- </q-page> -->
</template>

<script>
import {
  getCurrentInstance,
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeMount,
} from "vue";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import qs from "qs";
import { useQuasar } from "quasar";

export default defineComponent({
  // name: 'PageName',

  setup() {
    const $q = useQuasar();
    const instance = getCurrentInstance();
    const router = useRouter();
    let user = ref({});
    let formData = ref({});
    let eForm = ref(null);
    let isPwd1 = ref(true);
    let isPwd2 = ref(true);
    let expanded = ref(false);
    let submitting = ref(false);
    let password = ref("");
    let confirmation = ref("");
    let rulePassword = ref(false);
    let choix = ref(false);
    const token = $q.sessionStorage.getItem("token");

    onBeforeMount(() => {
      if (token === null) {
        router.push("/");
      }
    });

    onMounted(async () => {
      if (token) {
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/users/me`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        user.value = res.data;
        formData.value = user.value;
       
      }
    });

    let onSubmit = async () => {
      //formData.value.push(password.value)
      //console.log(formData.value);
      submitting.value = true;

      let userId = $q.sessionStorage.getItem("user");

      if (!choix.value) {
        try {
          let res = await instance.appContext.app.config.globalProperties.$api({
            url: `/users/${userId.id}`,
            method: "PUT",
            data: {
              nom: formData.value.nom,
              prenom: formData.value.prenom,
              user: formData.value.username,
              email: formData.value.email,
              //action: action
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          submitting.value = false;
          expanded.value = false;

          Notify.create({
            message: "Opération effectuée avec succès",
            type: "positive",
            position: "top-right",
          });
        } catch (error) {
          console.log(error);
          submitting.value = false;
          Notify.create({
            message: "Une erreur est survenue lord de l'opération",
            type: "negative",
            position: "top-right",
          });
        }
      } else if (password.value) {
        if (password.value.length < 6) {
          submitting.value = false;
          Notify.create({
            message:
              "Le champ mot de passe doit contenir au moins 6 caractères",
            type: "negative",
            position: "top-right",
          });
        } else if (password.value === confirmation.value) {
          try {
            let res =
              await instance.appContext.app.config.globalProperties.$api({
                url: `/users/${id}`,
                method: "PUT",
                data: {
                  user: formData.value.username,
                  email: formData.value.email,
                  password: password.value,
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            submitting.value = false;
            expanded.value = false;

            Notify.create({
              message: "Opération effectuée avec succès",
              type: "positive",
              position: "top-right",
            });
          } catch (error) {
            console.log(error);
            submitting.value = false;
            Notify.create({
              message: "Une erreur est survenue lord de l'opération",
              type: "negative",
              position: "top-right",
            });
          }
        } else {
          Notify.create({
            message: "Le champ mot de passe et confirmation sont differents",
            type: "negative",
            position: "top-right",
          });
          submitting.value = false;
        }
      } else {
        Notify.create({
          message: "Le champ mot de passe est vide",
          type: "negative",
          position: "top-right",
        });
        submitting.value = false;
      }
    };

    // watch(password, async () => {

    //   if (password.value === "" || null) {
    //     console.log("vide");
    //   } else {
    //     console.log("pas vide", password.value );
    //     rulePassword.value = true
    //   }

    // })

    watch(choix, async () => {
      //console.log(choix.value);
    });

    return {
      user,
      expanded,
      submitting,
      formData,
      eForm,
      isPwd1,
      isPwd2,
      onSubmit,
      password,
      confirmation,
      rulePassword,
      choix,
    };
  },
});
</script>
