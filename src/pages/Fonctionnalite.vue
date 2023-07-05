<template>
  <q-page padding>
    <!-- content -->

    <div style="display: none">
      <q-table
        grid
        :title="titre"
        :rows="items"
        :columns="columns"
        row-key="id"
        :filter="filter"
        hide-header
        v-model:pagination="pagination"
        @request="onRequest"
        :loading="loading"
        binary-state-sort
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>

    <!-- ================================================================================================================================================= -->

    <div style="margin-top: -50px">
      <h4>
        {{ titre }}
      </h4>

      <div class="row q-ml-sm" style="margin-bottom: 0px">
        <div class="col-md-10 col-sm-8 col-lg-10 col-xs-6">
          <q-btn
            outline
            color="primary"
            icon="add"
            label="Ajouter"
            @click="onShowCreate"
            v-if="actionCreate"
          />
        </div>

        <div class="col-md-2 col-sm-4 col-lg-2 col-xs-6">
          <q-input
            v-model="filter"
            placeholder="Recherche"
            dense
            debounce="300"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <div class="row" style="margin-top: 30px; margin-bottom: -80px">
      <div class="col-md-10 col-sm-8 col-xs-6"></div>

      <div class="col-md-2 col-sm-4 col-xs-6">
        <q-select
          style="width: 16rem"
          v-model="tri"
          :options="options"
          dropdown-icon="sort"
          borderless
        >
          <template v-slot:selected>
            Trier par :
            <q-chip
              v-if="tri"
              dense
              square
              color="white"
              text-color="primary"
              class="q-my-none q-ml-xs q-mr-none"
              size="1rem"
            >
              <q-avatar size="2.5rem" :icon="tri.icon" />
              {{ tri.label }}
            </q-chip>
          </template>
        </q-select>
      </div>
    </div>

    <div v-if="mission === true">
      <div v-for="item in group" :key="item">
        <div class="" style="margin-top: 65px; margin-bottom: 25px">
          <q-btn-dropdown
            flat
            color="primary"
            size="12px"
            dropdown-icon="expand_more"
          />

          {{ item[0] }}

          <q-separator
            class="float-right q-mt-sm"
            color="primary"
            style="width: 70%; height: 2.5px"
          />
        </div>

        <div class="row">
          <q-list v-for="list in item[1]" :key="list">
            <div class="col-md-4 col-sm-6 col-lg-3 q-pa-xs">
              <q-card
                class="border-radius-2 shadow-3 q-ma-xs"
                style="width: 350px; max-width: 350px"
              >
                <q-card-section>
                  <q-item class="q-pa-xs">
                    <q-item-section avatar class="self-start">
                      <q-icon
                        name="task"
                        color="primary"
                        style="font-size: 2.4em"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label
                        class="text-primary text-h5 text-weight-bold"
                        lines="1"
                      >
                        {{ list.titre }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-card-section class="">
                  <q-item>
                    <q-item-label>
                      <span
                        class="text-grey-7 text-weight-light ellipsis-2-lines"
                      >
                         <q-icon name="gps_fixed" color="primary" style="font-size: 1.4em"/>
                        {{ list.mission.titre }}
                      </span>
                    </q-item-label>
                  </q-item>
                  <q-item class="row items-center">
                    <q-icon
                      name="event_busy"
                      color="negative"
                      style="font-size: 1.5em"
                      class="q-mr-xs"
                    />
                    {{ $FormatDates(list.fin) }}
                    <q-space />
                    <q-chip size="sm" class="float-right">
                      <q-avatar color="primary" text-color="white">{{
                        list.taches.length
                      }}</q-avatar>
                      tâche(s)
                    </q-chip>
                  </q-item>
                </q-card-section>

                <q-linear-progress
                  rounded
                  color="primary"
                  track-color="teal-2"
                  class="q-mt-sm"
                />
                <q-card-actions align="right">
                  <q-btn
                    flat
                    color="primary"
                    icon="remove_red_eye"
                    @click="onModaleye(list.id)"
                  />
                   <q-btn
                    flat
                    color="primary"
                    icon="edit"
                    @click="onShowUpdate(item.id)"
                    v-if="actionUpdate"
                  />
                  <q-btn
                    flat
                    color="pink"
                    icon="delete"
                    @click="confirm(list.id)"
                    v-if="actionDelete"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </q-list>
        </div>
      </div>
    </div>

    <div v-if="date === true">
      <div class="" style="margin-top: 70px; margin-bottom: 30px">
        <q-btn-dropdown
          flat
          color="primary"
          size="12px"
          dropdown-icon="expand_more"
        />
        Toutes les fonctionnalités
        <q-separator
          class="float-right q-mt-md"
          color="primary"
          style="width: 70%; height: 2.5px"
        />
      </div>

      <div class="row">
        <q-list v-for="item in items" :key="item">
          <div class="col-md-4 col-sm-6 col-lg-3 q-pa-xs">
            <q-card
              class="border-radius-2 shadow-3 q-ma-xs"
              style="width: 350px; max-width: 350px"
            >
              <q-card-section>
                <q-item class="q-pa-xs">
                  <q-item-section avatar class="self-start">
                    <q-icon
                      name="task"
                      color="primary"
                      style="font-size: 2.4em"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      class="text-primary text-h5 text-weight-bold"
                      lines="1"
                    >
                      {{ item.titre }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>

              <q-card-section class="">
                <q-item>
                  <q-item-label>
                    <span
                      class="text-grey-7 text-weight-light ellipsis-2-lines"
                    >
                      <q-icon name="gps_fixed" color="primary" style="font-size: 1.4em"/>
                      {{ item.mission.titre }}
                    </span>
                  </q-item-label>
                </q-item>
                <q-item class="row items-center">
                  <q-icon
                      name="event_busy"
                      color="negative"
                      style="font-size: 1.5em"
                      class="q-mr-xs"
                    />
                  {{ $FormatDates(item.fin) }}
                  <q-space />
                  <q-chip size="sm" class="float-right">
                    <q-avatar color="primary" text-color="white">{{
                      item.taches.length
                    }}</q-avatar>
                    tâche(s)
                  </q-chip>
                </q-item>
              </q-card-section>
              <q-linear-progress
                rounded
                :value="item.progression / 100"
                :buffer="1.0"
                color="primary"
                track-color="teal-2"
                class="q-mt-sm"
              />
              <q-card-actions align="right">
                <q-btn
                  flat
                  color="primary"
                  icon="remove_red_eye"
                  @click="onModaleye(item.id)"
                />
                 <q-btn
                  flat
                  color="primary"
                  icon="edit"
                  @click="onShowUpdate(item.id)"
                  v-if="actionUpdate"
                />
                <q-btn
                  flat
                  color="negative"
                  icon="delete"
                  @click="confirm(item.id)"
                  v-if="actionDelete"
                />
              </q-card-actions>
            </q-card>
          </div>
        </q-list>
      </div>
    </div>

    <div v-if="instanceItems === true && items.length === 0" style="text-align: center">
      <!-- <q-icon name="mood_bad" class="q-ma-md text-h6 text-grey" style="font-size: 4rem;" /> -->
      <p class="q-ma-md text-h6 text-grey">Aucune fonctionnalité trouvée</p>
    </div>

    <!-- ================================================================================================================================================= -->

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
              lazy-rules
              :rules="[(val) => !!val || 'Le champ titre est obligatoire']"
            />

            <!-- v-model="createForm.mission" -->
            <q-select
              v-model="formMission"
              :options="missions"
              option-value="id"
              option-label="titre"
              emit-value
              map-options
              label=" Mission "
              :rules="[(val) => !!val || 'Merci de choisir une mission']"
            />

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
                label="Date de fin"
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

    <!-- Début de dialogue de modal eyes -->
    <q-dialog 
      v-model="modaleye"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up">
      <q-card class="my-card" style="width: 700px; max-width: 70vw">
        <q-btn
          icon="close"
          flat
          round
          color="negative"
          class="float-right"
          v-close-popup
        />
        <q-card-section class="no-wrap items-center text-h4 ellipsis">
          <q-icon name="task" color="primary" size="3rem" />

          {{ itemTache.titre }}
        </q-card-section>

        <q-card-section class="">
          <div class="text-h5">Liste des tâches</div>
          <div class="row">
            <div v-for="taches in itemTache.taches" :key="taches">
              <q-chip
                color="teal-1"
                icon="circle"
                text-color="teal-10"
                v-if="taches.progression > 0 && taches.progression < 100"
              >
                <!-- <q-spinner-hourglass color="dark" size="sm"/>
                  <div> -->
                <span class="ellipsis"> {{ taches.titre }}</span>
                <!-- </div> -->
              </q-chip>
              <q-chip
                color="gray"
                icon="circle"
                v-else-if="taches.progression == 0"
              >
                <span class="ellipsis"> {{ taches.titre }}</span>
              </q-chip>
              <q-chip
                color="green-9"
                text-color="white"
                icon="done_all"
                v-else-if="taches.progression >= 100"
              >
                <span class="ellipsis"> {{ taches.titre }}</span>
              </q-chip>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-linear-progress
            size="lg"
            :value="itemTache.progression / 100"
            :buffer="1.0"
            color="primary"
             track-color="teal-2"
            class="q-mt-sm"
            stripe
            rounded
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row justify-evenly">
            <div class="col-4">
              <q-icon name="circle" size="sm" color="primary " />
              {{ itemTache.progression }} % Terminée
            </div>
            <div class="col-4">
              <q-icon name="circle" size="sm" color="grey" />
              {{ 100 - itemTache.progression }} % Non terminée
            </div>
            <div class="col-4">
              <span v-if="duree.startToday">
                <q-icon name="schedule" size="sm" color="warning" /> Débute
                aujourd'hui
              </span>
              <span v-if="duree.startIn">
                <q-icon name="schedule" size="sm" color="warning" /> Finit dans
                {{ duree.finitdans }} jour(s)
              </span>
              <span v-if="duree.startnext">
                <q-icon name="schedule" size="sm" color="warning" /> Début dans
                {{ duree.debutdans }} jour(s)
              </span>
              <span v-if="duree.expireToday">
                <q-icon name="schedule" size="sm" color="warning" /> Finit
                aujourd'hui
              </span>
              <span v-if="duree.expireTo">
                <q-icon name="schedule" size="sm" color="warning" /> Finit il y
                a {{ duree.finitdans }} jours
              </span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Fin de dialogue de modal eyes -->

            <!-- Debut de dialogue d'update -->   

    <q-dialog
      v-model="showUpdate"
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
            >Modifier
            <span class="text-weight-bold"
              > la fonctionnalité</span
            ></q-toolbar-title
          >

          <q-btn flat round dense icon="close" color="negative" v-close-popup />
        </q-toolbar>
        <q-card-section class="">
          <q-form ref="createFormRef" @submit="submitUpdate()">
            <q-input
              label="Titre"
              v-model="createForm.titre"
              lazy-rules
              :rules="[(val) => !!val || 'Le champ titre est obligatoire']"
            />

            <!-- v-model="createForm.mission" -->
            <q-select
              v-model="formMission"
              :options="missions"
              option-value="id"
              option-label="titre"
              emit-value
              map-options
              label=" Mission "
              :rules="[(val) => !!val || 'Merci de choisir une mission']"
            />

      
            <q-card-actions vertical align="right">
              <q-btn
                type="submit"
                label="Modifier"
                class="q-mt-md q-pa-md no-border-radius"
                outline
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
   
    </q-dialog>  
    <!-- Fin de dialogue d'update -->


    <q-ajax-bar
      ref="barAjax"
      position="top"
      color="accent"
      size="10px"
      skip-hijack
    />

  </q-page>
</template>

<script>
import qs from "qs";
import lodash from "lodash";
import { useRouter } from "vue-router";
import { defineComponent, onMounted, getCurrentInstance, ref, watch, onBeforeMount} from "vue";
import { endOfDay, format, compareAsc, formatDistance, parseISO} from "date-fns";
import { useQuasar } from "quasar";
export default defineComponent({
  setup() {
    const $q = useQuasar();
    const instance = getCurrentInstance();
    const router = useRouter();
    const items = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const service = "fonctionnalites";
    const showCreate = ref(false);
    const modaleye = ref(false);
    const itemTache = ref({});
    const showUpdate = ref(false)
    let duree = ref({});
    const createForm = ref({
      debut: new Date(),
      fin: endOfDay(new Date()),
    });
    let formMission = ref();
    let finMission = ref();
    const createFormRef = ref();

    const previousPage = ref(0);
    const titre = ref("Fonctionnalités");
    const barAjax = ref(null)

    const missions = ref([]);
    let tri = ref();
    let mission = ref(false);
    let date = ref(true);
    let instanceItems = ref(false);
    let itemsToday = ref([]);
    let itemsYesterday = ref([]);
    const query = ref({
      _where: {},
      _start: 0,
      _limit: 10,
      _sort: "id:DESC",
    });

    const user = $q.sessionStorage.getItem("user");
    const token = $q.sessionStorage.getItem("token");
    let group = ref([]);

    const pagination = ref({
      sortBy: "createdAt",
      descending: false,
      page: 0,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    //=============Autorisations
    let actionFind = ref(false);
    let actionCreate = ref(false);
    let actionDelete = ref(false);
    let actionUpdate = ref(false);

    const columns = [
      {
        name: "titre",
        required: true,
        label: "Titre",
        align: "left",
        field: (row) => row.titre,
        sortable: true,
      },
      {
        name: "mission",
        required: true,
        label: "Mission",
        align: "left",
        field: (row) => row.mission.titre,
        sortable: true,
      },
    ];

    onBeforeMount(() => {
      if (token === null) {
        router.push("/");
      }
    });

    const findItems = async () => {
      try {
        query.value._where = {
          titre_contains: filter.value,
          completed: false,
        };

        let params = qs.stringify(query.value);

        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
            console.log('res.data',res.data);
        let count = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/count?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        pagination.value.rowsNumber = count.data;

        //console.log(items.value);
        //filter.value = ""

        let tabFilter = res.data;
        let grouped = [];
        grouped = lodash.groupBy(
          tabFilter,
          (tabFilter) => tabFilter.mission.titre
        );
        //console.log(grouped);

        group.value = Object.entries(grouped);

        // Formater la date du jour
        let today = format(new Date(), "yyyy-MM-dd");
        //console.log("Aujourd'hui : ",today);

        let tab = [];
        //itemsToday itemsYesterday

        for (const item of tabFilter) {
          // Fransformer la chaine de caractere en type date valide
          let date = parseISO(item.createdAt);
          //console.log(date.sort(compareAsc));
          if (format(date, "yyyy-MM-dd") === today) {
            itemsToday.value.push(item);
          }
        }

        items.value = res.data;
        instanceItems.value = true
      
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

      await findItems();

      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.page = queryPage;
    };
    /**
     * confirmation de la suppression
     */
    function confirm(id) {
      $q.dialog({
        dark: false,
        title: "Confirmation de la suppression",
        message: "Voulez vous vraiment supprimer cette fonctionnalité ?",
        ok: {push:true, color: 'negative',flat:true},
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          remove(id);
          console.log(">>>> OK");
        })
        .onOk(() => {
          console.log(">>>> second OK catcher");
        })
        .onCancel(() => {
          console.log(">>>> Cancel");
        })
        .onDismiss(() => {
          console.log("I am triggered on both OK and Cancel");
        });
    }
    /**
     * supression d'une fonctionnalité
     */
    const remove = async (id) => {
      const user = $q.sessionStorage.getItem("user");
      const token = $q.sessionStorage.getItem("token");
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

    //requette d'autorisation
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
      if (token) {
        actionFind.value = await autorisation("find");
        actionCreate.value = await autorisation("create");
        actionDelete.value = await autorisation("delete");
        actionUpdate.value = await autorisation("update");

        let params = qs.stringify({
          _where: {
            completed: false,
          },
          _start: 0,
          _limit: 1000,
          _sort: "createdAt:DESC",
        });
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/missions?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        missions.value = res.data;
        //await onRequest({pagination: pagination.value})

        //Bar ajax de chargement
        const barRef = barAjax.value
        barRef.start()
        await findItems();
        barRef.stop()
      }
    });

    const onShowCreate = () => {
      showCreate.value = true;
    };

    /**
     * fonction d'ajout d'une fonctionalité
     */
    const submitCreate = async () => {
      if (createFormRef.value.validate()) {
        try {
          createForm.value.mission = formMission.value;
          createForm.value.fin = endOfDay(new Date(createForm.value.fin));
          await instance.appContext.app.config.globalProperties.$api({
            url: `/${service}`,
            method: "post",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: createForm.value,
          });
          await findItems();
          showCreate.value = false;
        } catch (error) {
          console.log(error);
        }
        // vider formulaire
        createForm.value.titre = "";
        createForm.value.mission = "";
      }
    };

     const onShowUpdate = async(id) => {
    
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
          showUpdate.value = true
          createForm.value.titre = res.data[0].titre
          createForm.value.id = res.data[0].id
          formMission.value = res.data[0].mission

     }


    const submitUpdate = async () => {
       try {
          let id = createForm.value.id
          createForm.value.mission = formMission.value;
          let res = await instance.appContext.app.config.globalProperties.$api({
          url:`/${service}/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            titre: createForm.value.titre,
            mission: createForm.value.mission
          },
        });
        await findItems();
        showUpdate.value = false;
         
       } catch (error) {
         console.log(error);
       } 
   
    }
    /***
     * Fonction de vu de detail d'un modal
     */
    let onModaleye = async (id) => {
      modaleye.value = true;

      try {
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/${id}`,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        itemTache.value = res.data;
        var datedefin = new Date(itemTache.value.fin);
        var datededebut = new Date(itemTache.value.debut);

        /**
         *  Etape 1 : verifier si la date d'expiration est déjà passé
         */
        const result = compareAsc(Date.now(), datedefin);
        const entredate = formatDistance(Date.now(), datedefin).split(" ")[0];
        console.log("result |", result);
        if (result === -1) {
          //Date de fin pas encore passé
          const resultSecond = compareAsc(Date.now(), datededebut);
          console.log("debut |", resultSecond);
          if (resultSecond == -1) {
            //Pas encore debute
            duree.value.debutdans =
              parseInt(formatDistance(Date.now(), datededebut).split(" ")[0]) +
              1;
            duree.value.startnext = true;
            duree.value.startIn = false;
            duree.value.startToday = false;
            duree.value.expireTo = false;
            duree.value.expireToday = false;
          } else {
            // dejadebuter
            duree.value.debutdans = formatDistance(Date.now(), datedefin).split(
              " "
            )[0];
            if (duree.value.debutdans == "about") {
              duree.value.startToday = true;
              duree.value.startIn = false;
              duree.value.startnext = false;
              duree.value.expireTo = false;
              duree.value.expireToday = false;
            } else {
              duree.value.startToday = false;
              duree.value.startIn = false;
              duree.value.startnext = false;
              duree.value.expireToday = false;
              duree.value.expireTo = true;
              duree.value.finitdans =
                parseInt(formatDistance(Date.now(), datedefin).split(" ")[0]) +
                1;
            }
          }
        } else {
          // date de fin today or expiré
          duree.value.finitdans = formatDistance(Date.now(), datedefin).split(
            " "
          )[0];
          if (duree.value.finitdans == "about") {
            //finit aujourd'hui
            duree.value.expireToday = true;
            duree.value.startToday = false;
            duree.value.startIn = false;
            duree.value.startnext = false;
            duree.value.expireTo = false;
          } else {
            duree.value.expireToday = false;
            duree.value.expireTo = true;
            duree.value.startToday = false;
            duree.value.startIn = false;
            duree.value.startnext = false;
            duree.value.finitdans = formatDistance(datedefin, Date.now()).split(
              " "
            )[0];
            //expiré
          }
        }
        /* alert("Le nombre de jours entre les deux dates est de " + Math.round(Diff_jours) + " jours"); */
      } catch (error) {
        console.log(error);
      }
    };

    watch(tri, async () => {
      if (tri.value.label === "Mission") {
        mission.value = true;
        date.value = false;
      } else {
        mission.value = false;
        date.value = true;
      }
    });

    watch(formMission, async () => {
      //recupere la mission selectionnée
      if (formMission.value) {
        const query = qs.stringify({
          _where: [{ id: formMission.value }],
        });

        let mission = await instance.appContext.app.config.globalProperties.$api({
            url: `/missions?${query}`,
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        //console.log(mission.data[0]);

        finMission.value = format(new Date(mission.data[0].fin), "yyyy/MM/dd");
        //console.log("Fin", finMission.value);
      }
    });

    let debut = (date) => {
      let datenow = new Date();
      // si date < 10 on verifie si je mois est inferieur a 10 ou pas
      if (datenow.getDate() < 10) {
        if (datenow.getMonth() + 1 < 10) {
          let dateF =
            datenow.getFullYear() +
            "/0" +
            (datenow.getMonth() + 1) +
            "/0" +
            datenow.getDate();
          //console.log(dateF);
          return date >= dateF && date <= finMission.value;
        } else {
          let dateF =
            datenow.getFullYear() +
            "/" +
            (datenow.getMonth() + 1) +
            "/0" +
            datenow.getDate();
          //console.log(dateF);
          return date >= dateF && date <= finMission.value;
        }
        // si date > 10 on verifie si je mois est inferieur a 10 ou pas
      } else {
        if (datenow.getMonth() + 1 < 10) {
          let dateF =
            datenow.getFullYear() +
            "/0" +
            (datenow.getMonth() + 1) +
            "/" +
            datenow.getDate();
          //console.log(dateF);
          return date >= dateF && date <= finMission.value;
        } else {
          let dateF =
            datenow.getFullYear() +
            "/" +
            (datenow.getMonth() + 1) +
            "/" +
            datenow.getDate();
          //console.log(dateF);
          return date >= dateF;
        }
      }
    };

    let fin = (date) => {
      return date >= createForm.value.debut && date <= finMission.value;
      //return date <= '2021/09/18'
    };

    return {
      duree,
      titre,
      items,
      columns,
      filter,
      remove,
      loading,
      pagination,
      onRequest,
      onModaleye,
      modaleye,
      itemTache,
      showCreate,
      onShowCreate,
      submitUpdate,

      showUpdate,
      onShowUpdate,
      
      missions,
      createForm,
      createFormRef,
      submitCreate,
      confirm,
      group,
      tri,
      mission,
      date,
      itemsToday,
      itemsYesterday,
      debut,
      fin,
      formMission,
      finMission,
      barAjax,
      instanceItems,
      options: [
        {
          label: "Date",
          value: "date",
          icon: "event",
        },
        {
          label: "Mission",
          value: "fonction",
          icon: "gps_fixed",
        },
      ],

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
  text-align: justify
</style>

