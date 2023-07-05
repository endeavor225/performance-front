<template>
  <div class="col-sm-6 col-md-4 q-pa-xs">
    <q-card class="my-card" style="min-height: 360px">
      <div class="column q-py-md" style="height: 360px">
        <q-card-section horizontal class="col-2 items-center">
          <q-card-section>
            <p class="q-mt-sm q-mb-xs items-center demo-title">
              <span class="text-primary text-h6 text-weight-bold">
                <q-avatar size="md" square>
                  <img src="icons/mission.svg" />
                </q-avatar>
              </span>
              <span class="text-primary text-h6 text-weight-bold q-ml-sm">
                {{ itemListe.titre }}
              </span>
            </p>
          </q-card-section>
          <q-space />
          <q-btn
            unelevated
            rounded
            color="green-1"
            text-color="secondary"
            size="sm"
            icon="edit"
            class="q-pa-sm q-mr-sm"
            @click="onShowUpdate(itemListe.id)"
            v-if="actionUpdate"
          />
        </q-card-section>
        <q-card-section class="q-pb-none col-8">
          <span class="text-weight-thin text-grey-7">
            <q-icon name="info" color="white" /> Description </span
          >
          <q-separator />
          <p class="text-weight-light text-grey-7 q-my-xs ellipsis-3-lines">
            {{ itemListe.description }}
          </p>
        </q-card-section>
        <q-card-section horizontal class="col-2 q-px-xs items-center">
          <q-item>
            <p class="q-mt-sm q-mb-xs">
              <q-icon name="event" class="q-mr-xs" color="grey-10" />
              {{ $FormatDates(itemListe.fin) }}
            </p>
          </q-item>
          <q-space />
          <q-btn
            v-if="itemListe.users.length !== 0"
            color="grey-10"
            flat
            no-caps
            @click="expanded = !expanded"
            class="text-subtitle2 text-weight-light"
          >
            <q-icon
              :name="expanded ? 'group' : 'groups'"
              class="q-mr-xs"
              color="grey-10"
            />
            <div class="q-pl-xs">Membre</div>
          </q-btn>
          <q-btn
            v-if="actionUpdate && itemListe.users.length === 0"
            flat
            padding="xs"
            size="md"
            no-caps
            @click="toggle"
            class="text-subtitle2 text-weight-light"
          >
            <q-icon name="group_add" color="green-9" />
            <div class="q-pl-xs text-green-9">Ajouter membre</div>
          </q-btn>
        </q-card-section>
      </div>
      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section>
            <div class="q-gutter-xs">
              <div :class="{ 'truncate-chip-labels': truncate }">
                <q-btn
                  flat
                  round
                  padding="sm"
                  size="md"
                  icon="group_add"
                  color="green-6"
                  @click="toggle"
                  v-if="actionUpdate"
                />
                <div v-if="actionDelete">
                  <q-chip
                    v-for="item in usersDev"
                    :key="item.id"
                    removable
                    @remove="confirm(item.id)"
                    color="light-blue-1"
                    text-color="blue-14"
                    icon="person"
                  >
                    {{ item.username }}
                  </q-chip>
                </div>
                <div v-else>
                  <q-chip
                    v-for="item in usersDev"
                    :key="item.id"
                    color="light-blue-1"
                    text-color="blue-14"
                    icon="person"
                  >
                    {{ item.username }}
                  </q-chip>
                </div>
              </div>
            </div>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>

      <!-- Debut de dialogue d'update -->
    <q-dialog
      v-model="showUpdate"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="text-primary" style="width: 700px; max-width: 80vw">
        <q-toolbar class="q-pl-md q-pt-md">
          <q-avatar square>
            <img src="icons/target.png"/>
          </q-avatar>

          <q-toolbar-title
            >Modifier
            <span class="text-weight-bold"
              >la mission</span
            ></q-toolbar-title
          >

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="">
          <q-form ref="updateFormRef" @submit="submitUpdate">
            <q-input
              label="Titre"
              v-model="updateForm.titre"
              :rules="[(val) => !!val || 'Merci de saisir un titre']"
            />
            <div class="" style="max-width: 100%">
              <q-input
                label="Description"
                type="textarea"
                v-model="updateForm.description"
                rows="2"
              />
            </div>

         
            <q-card-actions vertical align="right">
              <q-btn
                type="submit"
                label="modifier"
                class="q-mt-md q-pa-md no-border-radius"
                outline
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Fin de dialogue d'update -->
  </div>
</template>

<script>
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import formatISO from "date-fns/fp/formatISO";
import { useQuasar } from "quasar";

import qs from "qs";
import {
  defineComponent,
  onMounted,
  getCurrentInstance,
  ref,
  inject,
} from "vue";
export default defineComponent({
  name: "ListeMission",
  components: {},
  props: {
    itemListe: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const $q = useQuasar();
    let fonctions = ref([]);
    let taches = ref([]);
    const service = "missions";
    let sousTaches = ref([]);
    const instance = getCurrentInstance();
    let allUsers = []; // tableau pour stoker la liste des developpeurs à afficher dans le dialogue
    let usersDev = ref([]);
    let options = ref([]);
    let toolbar = ref([]);
     const filter = ref("");
    const showUpdate = ref(false)
    const updateFormRef = ref()
    const updateForm = ref({})
    const categorie_missions = ref([])
    const query = ref({
      _where: {},
      _sort: "id:DESC",
    });
    let listedesMission = inject("listedesMission");
    //=============Autorisations
    let actionFind = ref(false);
    let actionCreate = ref(false);
    let actionDelete = ref(false);
    let actionUpdate = ref(false);

    // let token =instance.appContext.app.config.globalProperties.$sdata.value.auth.jwt;
    // let user =instance.appContext.app.config.globalProperties.$sdata.value.auth.user;

    const user = $q.sessionStorage.getItem("user");
    const token = $q.sessionStorage.getItem("token");

    const findItems = async () => {
      try {
        //query.value._where.titre_contains = filter.value
        query.value._where = {
          titre_contains: filter.value,
          "organisation.id":
            user.organisations.length > 0 ? user.organisations[0].id : "",
        };
        //query.value._limit = pagination.value.rowsPerPage
        let params = qs.stringify(query.value);
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let count = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/count?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //console.log(count);
        // pagination.value.rowsNumber = count.data;
        console.log('res.data',res.data);
        props.itemListe.value = res.data;
        //console.log(items)
        //filter.value = ""
      } catch (error) {
        console.log(error);
      }
    };
    let actualisation = async () => {
      query.value._where = {
        mission: props.itemListe.id,
      };
      let params = qs.stringify(query.value);
      let res = await instance.appContext.app.config.globalProperties.$api({
        url: `/fonctionnalites?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fonctions.value = res.data;

      /**
       * recuperer les utilisateurs
       * */
      query.value._where = {
        "missions.id": props.itemListe.id,
      };
      params = qs.stringify(query.value);
      //console.log('params |', params)
      res = await instance.appContext.app.config.globalProperties.$api({
        url: `/users?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      usersDev.value = res.data;
     // console.log('usersDev.value |', usersDev.value)

      query.value._where = {
        "fonctionnalite.mission": props.itemListe.id,
      };
      params = qs.stringify(query.value);
      res = await instance.appContext.app.config.globalProperties.$api({
        url: `/taches?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      taches.value = res.data;
      //console.log('dadada', taches.value);
    };

    const autorisation = async (action) => {
      try {
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/customize`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            user: user,
            service: service,
            action: action,
          },
        });
        var trouv = res.data;

        if (trouv) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(async () => {
      //requette d'autorisation
      actionFind.value =   await autorisation("find")
      actionCreate.value = await autorisation("create")
      actionDelete.value = await autorisation("delete")
      actionUpdate.value = await autorisation("update")  

      console.log('actionUpdate.value',actionUpdate.value);

      console.log('listedesMission ',listedesMission.value);
      await actualisation()
    })
    /**
     * Fonction d'activation de suppression
     */

    confirm = async (id) => {
      $q.dialog({
        dark: false,
        title: "Confirmation de la suppression",
        message: "Voulez vous vraiment supprimer cette mission ?",
        ok: {push:true, color: 'negative',flat:true},
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          removeDev(id);
          console.log(">>>> OK");
        })
        .onCancel(() => {
          console.log(">>>> Cancel");
        })
        .onDismiss(() => {
          console.log("I am triggered on both OK and Cancel");
        });
      // await findItems()
    };

    /**
     * Fonction de suppression
     */
    let removeDev = async (e) => {
      console.log("supression ", e);
      
      //  let res = await instance.appContext.app.config.globalProperties.$api({
      //   url: `/missions/${props.itemListe.id}`,
      //   method: "delete",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      console.log(" old | ", res.data.users);
      for (let index = 0; index < res.data.users.length; index++) {
        if (res.data.users[index].id == e) {
          res.data.users.splice(index, 1);
        }
      } 
      //     console.log(' new | ', res.data.users)

      //  let ras = await instance.appContext.app.config.globalProperties.$api({
      //    url: `/missions/${props.itemListe.id}`,
      //         method: "put",
      //         data: res.data,
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //         },
      //       })
       query.value._where = {
        "organisation.id":
          user.organisations.length > 0 ? user.organisations[0].id : "",
      };
      console.log("user.organisations.length |", user.organisations.length);
      //query.value._limit = pagination.value.rowsPerPage
      let params = qs.stringify(query.value);
      let ress = await instance.appContext.app.config.globalProperties.$api({
        url: `/missions?${params}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      listedesMission.value = ress.data;
      console.log("ress |", ress.data);
      console.log("ldM |", listedesMission.value);
      await actualisation(); 
      //await findItems();
    };

     /**
     * Fonction de modification
     */
       const onShowUpdate = async(id) => {
        console.log('id',id);
        //ici
        query.value._where = {
            completed: false,
            "id": id,
          };
        let params = qs.stringify(query.value);
       let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          }
          });
          //console.log('response',res);
   
          updateForm.value.titre = res.data[0].titre
          updateForm.value.id = res.data[0].id
          updateForm.value.description = res.data[0].description
          showUpdate.value = true
     }
      let submitUpdate = async() => {
           try {
          let id = updateForm.value.id
          let res = await instance.appContext.app.config.globalProperties.$api({
          url:`/${service}/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            titre: updateForm.value.titre,
            description: updateForm.value.description
          },
        });
        await findItems();
        showUpdate.value = false;
         
       } catch (error) {
         console.log(error);
       } 
      }
    /*
     * Recuper la liste des utilisateurs
     */
    
    let getAllUser = async () => {
      //empecher les utilisateur de role standart et chef de voir l'Utilisateur admin
      let res;
      if (user.role.name!=='Admin') {
         query.value._where = {
          'role.name_ne':'Admin'
        };
      let params = qs.stringify(query.value);
       res = await instance.appContext.app.config.globalProperties.$api({
        url: `/users?${params}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      }else{
        query.value._where = {
          'statut': true
        };
      let params = qs.stringify(query.value);
        res = await instance.appContext.app.config.globalProperties.$api({
        url: `/users?${params}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      }
      /** Debut etape 1.1 */
      allUsers = [];
      res.data.forEach((e) => {
        allUsers.push({ label: e.username, value: e.id });
        /*  Fin etape 1.1 */
      });
    };
    /**
     * function permettant d'activer la boite de Dialoge
     *
     * 1. Recuperer la liste des developpeurs
     *    1.1. les mettres dans le tableau `allUsers` qui va permettre d'afficher tout les utilisateurs
     * 3. Recuperer les ID des developpeur déjà assigner à une mission et mettre dans le tableau userAffect
     * 4. Declancher le diaolgue
     */

    let toggle = async () => {
      /* Debut Etape 1 */
      await getAllUser();
      /* Fin Etape 1 */
      /*
       *  Debut etape 2
       */
      let userAffect = []; // tableau qui contient les identifiants des utilisateurs déjà choisit
      usersDev.value.forEach((e) => {
        userAffect.push(e.id);
      });
      console.log('allUsers',allUsers);

      /* Fin etape 2  */

      /** debut du code du dialogue */
      $q.dialog({
        title: "Liste des membres",
        message: "Choisir les membres concernés",
        options: {
          type: "toggle",
          model: userAffect,
          // inline: true,
          items: allUsers,
        },
        transitionShow: "slide-down",
        transitionHide: "slide-down",
        cancel: true,
        persistent: true,
      })
        .onOk(async (data) => {
          console.log(">>>> OK, received", data);
          let res = await instance.appContext.app.config.globalProperties.$api({
            url: `/users`,
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          let newDev = [];
          data.forEach((idAdd) => {
            res.data.forEach((e) => {
              if (e.id == idAdd) {
                newDev.push(e);
              }
            });
          });

          res = await instance.appContext.app.config.globalProperties.$api({
            url: `/missions/${props.itemListe.id}`,
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(res.data.users);
          console.log("nouvelle valeur |", newDev);
          res.data.users.splice(0, res.data.users.length);
          console.log("nettoyer | ", res.data.users);
          res.data.users = newDev;
          console.log("nouvelle valeur | ", res.data.users);
          //res.data.users = Object.assign(res.data.users,newDev)
          console.log("res.data | onUpdateMission | ", res.data);

          let ras = await instance.appContext.app.config.globalProperties.$api({
            url: `/missions/${props.itemListe.id}`,
            method: "put",
            data: res.data,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("itemListe.users.length |", props.itemListe.users.length);
          await actualisation();
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    };

    return {
      fonctions,
      taches,
      sousTaches,
      usersDev,
      options,
      removeDev,
      toolbar,
      toggle,
      expanded: ref(false),
      truncate: ref(true),
      confirm,
      updateForm ,
      updateFormRef,
      showUpdate,
      onShowUpdate,
     submitUpdate ,
     categorie_missions,
      //autorisation
      actionFind,
      actionCreate,
      actionDelete,
      actionUpdate,
    };
  },
});
</script>
<style lang="sass" scoped>
.demo-title
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 1
  -webkit-box-orient: vertical
  .demo
    overflow: hidden
    display: -webkit-box
    -webkit-line-clamp: 3
    -webkit-box-orient: vertical
</style>
