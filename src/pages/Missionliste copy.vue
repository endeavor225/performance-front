<template>
  <q-page padding>
    <!-- content -->
    <div>
      <q-table
        grid
        :title="titre"
        :rows="items"
        row-key="id"
        :filter="filter"
        hide-header
        v-model:pagination="pagination"
        @request="onRequest"
        :loading="loading"
        binary-state-sort
      >

      <template v-slot:top-right>
        <q-input v-model="filter" placeholder="Recherche"  dense debounce="300">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:top-left>
        <div style="margin-top: -50px">
          
          <h4>
          </h4>
          <q-btn outline color="primary" icon="add" label="Ajouter" @click="onShowCreate" v-if="actionCreate"/>
        </div>
      </template>

      <template v-slot:item="p" >
        <div
        class=" col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        >
         
           <liste-mission
            :itemListe="p.row"
          />
        
        </div> 
      </template>
      </q-table>
    </div>

    <!-- Debut de dialogue d'ajout -->
    <q-dialog
      v-model="showCreate"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="text-primary" style="width: 700px; max-width: 80vw">
        <q-toolbar class="q-pl-md">
          <q-avatar square>
            <img src="icons/completed-task.svg" />
          </q-avatar>

          <q-toolbar-title
            >Ajouter
            <span class="text-weight-bold"
              >une fonctionnalité</span
            ></q-toolbar-title
          >

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="">
          <q-form ref="createFormRef" @submit="submitCreate">
            <q-input
              label="Titre"
              v-model="createForm.titre"
              :rules="[(val) => !!val || 'Merci de saisir un titre']"
            />
            <div class="" style="max-width: 100%">
              <q-input
                label="Description"
                type="textarea"
                v-model="createForm.description"
                rows="4"
              />
            </div>

            <div class="">
              <q-input
                v-model="createForm.debut"
                mask="date"
                :rules="['date']"
                label="Date de debut"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="createForm.debut" :options="debut">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Fermer"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="">
              <q-input
                v-model="createForm.fin"
                mask="date"
                :rules="['date']"
                label="Fin de debut"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="createForm.fin" :options="fin">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Fermer"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div>
              <q-select
                v-model="createForm.categorie_mission"
                :options="categorie_missions"
                option-value="id"
                option-label="titre"
                emit-value
                map-options
                label=" Catégorie de la mission "
                :rules="[(val) => !!val || 'Merci de choisir une mission']"
              />
            </div>
            <q-card-actions vertical align="right">
              <q-btn
                type="submit"
                label="Créer"
                class="q-mt-md q-pa-md no-border-radius"
                outline
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Fin de dialogue d'ajout -->
  </q-page>
</template>

<script>
import qs from "qs";
import { useQuasar } from 'quasar'
import {useRouter} from "vue-router"
import { defineComponent, onMounted, getCurrentInstance, ref, onBeforeMount } from "vue";
import ListeMission from "components/Mission-dev/Item.vue";
export default defineComponent({
  components: {
    ListeMission,
    },
  setup() {
    const $q = useQuasar()
    const instance = getCurrentInstance();
    const router = useRouter();
    const items = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const service = "missions";
    const showCreate = ref(false);

    const createForm = ref({});
    const createFormRef = ref();
    const UpdateFormRef = ref();
    const updateForm =ref()

    const organisations = ref([])
    const categorie_missions = ref([])

    const previousPage = ref(0);
    const titre = ref("Mission");
    var search = ref("");
    const query = ref({
      _where: {},
      _start: 0,
      _limit: 6,
      _sort: "id:DESC",
    });

    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token') 

    onBeforeMount(() => {
      if (token === null) {
        router.push('/')
      }
    })

    const interrupteurActualisation = ref(false) // variable me pertant de faire l'actualisation de la page
    const pagination = ref({
      sortBy: "createdAt",
      descending: false,
      page: 0,
      rowsPerPage: 6,
      rowsNumber: 0,
    });

    var toolbar = ref(false);
    let options = ref([]);
    let modelMultiple= ref([])
    //=============Autorisations
    let actionFind = ref(false);;
    let actionCreate = ref(false)
    let actionDelete = ref(false);
    let actionUpdate = ref(false);
    /**
     * Methode et action
     */
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
      
        let count = await instance.appContext.app.config.globalProperties.$api(
          {
            url: `/${service}/count?${params}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        //console.log(count);
        pagination.value.rowsNumber = count.data;

        items.value = res.data;
        //console.log(items)
        //filter.value = ""
      } catch (error) {
        console.log(error);
      }
    };

    const onRequest = async (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;

      let queryPage = 0;
      if (page == previousPage.value) {
          queryPage = page - 1;
      } else {
        queryPage = page;
      }
      query.value._limit = rowsPerPage;
      query.value._start = query.value._limit * (queryPage - 1);


      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.page = queryPage;
     
    };
       

    const remove = async (id) => {
      console.log("id mission", id);
      try {
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/${id}`,
          method: "delete",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await findItems();
      } catch (error) {}
    };
    const actualisation = async ()=>{
      await findItems()
    }


//requette d'autorisation
    const autorisation =async(action) =>{
      try {

          let res =  await instance.appContext.app.config.globalProperties.$api({
                url: `/customize`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    user: user,
                    service: service,
                    action: action
                }
            })
             var trouv = res.data
             //console.log(res.data);
            if (trouv) {
                return true
               
            }
            else {
                return false
              
            }
        
        } catch (error) {
            console.log(error);
        }
         }

    onMounted(async () => {
      if (token) {
        await findItems()
        actionFind.value =   await autorisation("find")
        actionCreate.value = await autorisation("create")
        actionDelete.value = await autorisation("delete")
        actionUpdate.value = await autorisation("update")  

        //let token = instance.appContext.app.config.globalProperties.$sdata.value.auth.jwt
        //let user = instance.appContext.app.config.globalProperties.$sdata.value.auth.user
        const user = $q.sessionStorage.getItem('user')
        const token = $q.sessionStorage.getItem('token')
        let params = qs.stringify({
          _start: 0,
          _limit: 1000,
          _sort: "createdAt:DESC"
        })
          
        let res = await instance.appContext.app.config.globalProperties.$api(
            {
              url:`/organisations?${params}`,
              headers:{
                Authorization: `Bearer ${token}`
              },
            }
        )

        organisations.value = res.data

        res = await instance.appContext.app.config.globalProperties.$api(
            {
              url:`/categorie-missions?${params}`,
              headers:{
                Authorization: `Bearer ${token}`
              },
            }
        )
        categorie_missions.value = res.data
        await onRequest({ pagination: pagination.value });
        if(interrupteurActualisation.value){
          await findItems()
          interrupteurActualisation.value = false
        }
      }
    });

    
  


    const onShowCreate = () => {
      showCreate.value = true;
    };
 /**
     * fonction d'ajout d'une mission
     */
    const submitCreate = async () => {
      const user = $q.sessionStorage.getItem('user')
      const token = $q.sessionStorage.getItem('token')

      // let token = instance.appContext.app.config.globalProperties.$sdata.value.auth.jwt;
      // let user = instance.appContext.app.config.globalProperties.$sdata.value.auth.user;
      if (createFormRef.value.validate()) {
        createForm.value.organisation =
          user.organisations.length > 0 ? user.organisations[0].id : null;

        try {
           createForm.value.debut = new Date(createForm.value.debut)
          createForm.value.fin = new Date(createForm.value.fin)
          let res = await instance.appContext.app.config.globalProperties.$api(
            {
              url: `/${service}`,
              method: "post",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: createForm.value,
            }
          );
          await findItems();
          showCreate.value = false;
        } catch (error) {}
      }  
       // vider formulaire
        createForm.value.titre = ''
        createForm.value.description = ''
        createForm.value.categorie_mission = ''
      
    };
    const updateId = ref()
    /*
     * Recuper la liste des utilisateurs  
     */ 
    const activeToolbar = async (id) =>{
      //let token = instance.appContext.app.config.globalProperties.$sdata.value.auth.jwt;
      const user = $q.sessionStorage.getItem('user')
      const token = $q.sessionStorage.getItem('token')
      let res = await instance.appContext.app.config.globalProperties.$api({
            url: `/users`,
            method: 'get',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          toolbar.value = true
        console.log("mesDev | ", res.data)
        console.log('id | func toolbar | ', id)
        updateId.value = id
        options.value = res.data 
        console.log('options.value | func : Toolbar | ', options.value)
    }

    /**
     * Function de mise à jour de la mission (ajout des developpeur charger de la mission)
     */

    const onUpdateMission = async (id) =>{
      console.log('updateForm.value | onUpdateMission |', updateId.value)
       //let token = instance.appContext.app.config.globalProperties.$sdata.value.auth.jwt;
      const user = $q.sessionStorage.getItem('user')
      const token = $q.sessionStorage.getItem('token')
          let res = await instance.appContext.app.config.globalProperties.$api({
            url: `/missions/${updateId.value}`,
            method: 'get',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
              console.log(res.data.users)
              res.data.users = modelMultiple.value
              console.log('res.data | onUpdateMission | ', res.data)
               let ras = await instance.appContext.app.config.globalProperties.$api({
                url: `/missions/${updateId.value}`,
                method: 'put',
                data: res.data,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })  
      console.log(ras.data )
    }

    let debut = (date) => {
      let datenow = new Date();

      // si date < 10 on verifie si je mois est inferieur a 10 ou pas
      if (datenow.getDate() < 10) {
        if ( datenow.getMonth()+ 1 < 10) {
          let dateF = datenow.getFullYear() + "/0" + (datenow.getMonth() + 1) + "/0" + datenow.getDate();
          //console.log(dateF);
          return date >= dateF;
        } else {
          let dateF = datenow.getFullYear() + "/" + (datenow.getMonth() + 1) + "/0" + datenow.getDate();
          //console.log(dateF);
          return date >= dateF;
        }
        // si date > 10 on verifie si je mois est inferieur a 10 ou pas
      } else {
        if ( datenow.getMonth()+ 1 < 10) {
          let dateF = datenow.getFullYear() + "/0" + (datenow.getMonth() + 1) + "/" + datenow.getDate();
          //console.log(dateF);
          return date >= dateF;
        } else {
          let dateF = datenow.getFullYear() + "/" + (datenow.getMonth() + 1) + "/" + datenow.getDate();
          //console.log(dateF);
          return date >= dateF;
        }
      }
    }

    let fin = (date) => {
      return date >= createForm.value.debut;
    }

    return {
      titre,
      items,
      filter,
      remove,
      loading,
      pagination,
      organisations,
      categorie_missions,
      onRequest,
      showCreate,
      onShowCreate,

      createForm,
      createFormRef,
      submitCreate,
      activeToolbar,
      toolbar,
      onUpdateMission,
      UpdateFormRef,
      actualisation ,
      search,
      /*  Mes variables pour les tests */
      options,
      debut,
      fin,
      actionFind,
      actionCreate,
      actionDelete,
      actionUpdate
    };
  },
});
</script>