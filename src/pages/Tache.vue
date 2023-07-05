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

    <div style="margin-top: -50px">
      <h4 v-if="titre === 'Taches'">Tâches</h4>

      <div class="row q-ml-sm" style="margin-bottom: 0px">
        <div class="col-md-10 col-sm-8 col-lg-10 col-xs-6">
          <q-btn
            outline
            color="primary"
            icon="add"
            label="Ajouter"
            @click="onShowCreate"
            v-if="actionCreate === true"
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

    <div v-if="fonctionnalite === true">
      <div v-for="item in grouped" :key="item">
        <div class="" style="margin-top: 65px; margin-bottom: 25px">
          <q-btn-dropdown
            flat
            color="primary"
            size="12px"
            dropdown-icon="expand_more"
          />

          {{ item[0] }}

          <q-separator
            class="float-right q-mt-md"
            color="primary"
            style="width: 75%; height: 2.5px"
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
                        name="task_alt"
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
                        <q-icon name="task" color="primary" style="font-size: 1.4em"/>
                        {{ list.fonctionnalite.titre }}
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
                        list.sous_taches.length
                      }}</q-avatar>
                      sous-tâche(s)
                    </q-chip>
                  </q-item>
                </q-card-section>
                <q-linear-progress
                  rounded
                  :value="list.progression / 100"
                  :buffer="1.0"
                  color="primary"
                  track-color="blue-4"
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
                    @click="onModaleye(list.id)"
                  />
                  
                  <q-btn
                    flat
                    color="negative"
                    icon="delete"
                    @click="confirm(list)"
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
      <!-- ======================================== Aujourd'hui ============================== -->

      <div class="" style="margin-top: 65px; margin-bottom: 25px">
        <q-btn-dropdown
          flat
          color="primary"
          size="12px"
          dropdown-icon="expand_more"
        />
        Toutes les tâches
        <q-separator
          class="float-right q-mt-md"
          color="primary"
          style="width: 75%; height: 2.5px"
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
                      name="task_alt"
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
                      <q-icon name="task" color="primary" style="font-size: 1.4em"/>
                      {{ item.fonctionnalite.titre }}
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
                      item.sous_taches.length
                    }}</q-avatar>
                    sous tâche(s)
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
                  @click="confirm(item)"
                  v-if="actionDelete"
                />
              </q-card-actions>
            </q-card>
          </div>
        </q-list>
      </div>
    </div>

    <!-- retour si items est vide -->
    <div v-if="instanceItems === true && items.length === 0" style="text-align: center">
      <p class="q-ma-md text-h6 text-grey">Aucune tâche trouvée</p>
    </div>

    <!-- Debut de la card -->

    <!-- Fin de la card -->

    <!-- Debut de dialogue d'ajout -->
    <q-dialog
      v-model="showCreate"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="text-primary" style="width: 700px; max-width: 80vw">
        <q-toolbar class="q-pl-md">
          <q-avatar>
            <img src="icons/tick.svg" />
          </q-avatar>

          <q-toolbar-title
            >Ajouter
            <span class="text-weight-bold">une tâche</span></q-toolbar-title
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

            <q-select
              v-model="formFonctionnalite"
              :options="fonctionnalites"
              option-value="id"
              option-label="titre"
              label="Fonctionalité"
              emit-value
              map-options
              lazy-rules
              :rules="[(val) => !!val || 'Merci de choisir une fonctionalité']"
            />
            <div class="">
              <q-input
                v-model="createForm.debut"
                mask="date"
                :rules="['date']"
                label="Date de début"
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
            <!-- input permettant de prendre le poids d'une tâche -->
            <q-select
              v-model="createForm.poids"
              :options="difficulteOptions"
              label="Niveau de la tâche"
            />
            <q-card-actions vertical align="right">
              <q-btn
                type="submit"
                label="Ajouter"
                class="q-mt-md q-pa-md no-border-radius"
                outline
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Fin de dialogue d'ajout -->

    <!-- <q-dialog v-model="showCreate" maximized persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <h5>Créer une Tâche</h5>
          <q-space />
          <q-btn icon="close" color="black" flat round v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="createFormRef" @submit="submitCreate">
            <q-input label="Titre" v-model="createForm.titre" />

            <q-select 
            v-model="createForm.fonctionnalite"
            :options="fonctionnalites"
            option-value="id"
            label="Fonctionalité"
            emit-value
            map-options
            />
            input permettant de prendre le poids d'une tâche  
            <q-select 
              v-model="createForm.poids" 
              :options="difficulteOptions" 
              label="Niveau de la tâche" 
              />
            
            <q-btn type="submit" label="Créer" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog> -->

    <!-- Début de dialogue de modal eyes -->

    <q-dialog 
      v-model="modaleye"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up">>
      <q-card class="my-card" style="width: 700px; max-width: 70vw">
        <q-btn
          icon="close"
          flat
          round
          color="negative"
          class="float-right"
          v-close-popup
        />
        <q-card-section class="no-wrap items-center text-h6 ellipsis">
          <q-icon name="task_alt" color="primary" style="font-size: 2.4em" />
          <!-- <img src="icons/tick.svg" style="font-size: 2.4em;"/> -->
          {{ itemTache.titre }}
        </q-card-section>
        <q-card-section class="justify-center">
          <div class="text-h5">Liste sous-tâches</div>
          <div class="row">
            <div
              class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-px-xs"
              v-for="soustache in itemTache.sous_taches"
              :key="soustache.id"
            >
              <q-chip
                color="teal-1"
                icon="circle"
                text-color="teal-10"
                v-if="soustache.progression > 0 && soustache.progression < 100"
              >
                <!-- <q-spinner-hourglass color="dark" size="sm"/>
                  <div> -->
                <span class="ellipsis text-weight-medium">
                  {{ soustache.titre }}</span
                >
                <!-- </div> -->
              </q-chip>
              <q-chip
                color="gray"
                icon="circle"
                v-else-if="soustache.progression == 0"
              >
                <span class="ellipsis"> {{ soustache.titre }}</span>
              </q-chip>
              <q-chip
                color="primary"
                text-color="white"
                icon="done_all"
                v-else-if="soustache.progression >= 100"
              >
                <span class="ellipsis"> {{ soustache.titre }}</span>
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
              <q-icon name="circle" size="sm" color="teal-10" />
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
    <!-- <q-dialog v-model="modaleye">
      <q-card style="width: 40%; height: 35%">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1">Information Tache</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-red" />
        </q-card-section>
        <q-card-section>
          <div class="text-h6">
            {{ itemTache.titre }}
          </div>
          <div class="col-auto text-grey-8 text-caption q-pt-md">
            Date Debut: {{ $FormatDate(itemTache.debut) }} <br />
            Date Fin: {{ $FormatDate(itemTache.fin) }} <br />
            Progression: {{ itemTache.progression }}%
          </div>
        </q-card-section>
      </q-card>
    </q-dialog> -->

        <!-- Debut de dialogue d'update -->   

    <q-dialog
      v-model="showUpdate"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="text-primary" style="width: 700px; max-width: 80vw">
      <q-toolbar class="q-pl-md">
          <q-avatar>
            <img src="icons/tick.svg" />
          </q-avatar>

          <q-toolbar-title
            >Modifier
            <span class="text-weight-bold">la tâche</span></q-toolbar-title
          >

          <q-btn flat round dense icon="close" color="negative" v-close-popup />
        </q-toolbar>
          <q-card-section class="">
          <q-form ref="createFormRef" @submit="submitUpdate">
            <q-input
              label="Titre"
              v-model="createForm.titre"
              lazy-rules
              :rules="[(val) => !!val || 'Le champ titre est obligatoire']"
            />

            <q-select
              v-model="formFonctionnalite"
              :options="fonctionnalites"
              option-value="id"
              option-label="titre"
              label="Fonctionalité"
              emit-value
              map-options
              lazy-rules
              :rules="[(val) => !!val || 'Merci de choisir une fonctionalité']"
            />
        
            <!-- input permettant de prendre le poids d'une tâche -->
            <q-select
              v-model="createForm.poids"
              :options="difficulteOptions"
              label="Niveau de la tâche"
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
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { endOfDay, compareAsc, formatDistance, format } from "date-fns";
import {
  defineComponent,
  onMounted,
  getCurrentInstance,
  ref,
  watch,
  onBeforeMount,
} from "vue";
export default defineComponent({
  setup() {
    const $q = useQuasar();
    const instance = getCurrentInstance();
    const router = useRouter();
    const items = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const service = "taches";
    const showCreate = ref(false);
    const itemTache = ref({});
    const showUpdate = ref(false)
    const modaleye = ref(false);

    const barAjax = ref(null)
    let instanceItems = ref(false);

    const createForm = ref({});
    const createFormRef = ref();
    let duree = ref({});
    let formFonctionnalite = ref();
    let finFonctionnalite = ref();

    const fonctionnalites = ref([]);
    let grouped = ref([]);
    let fonctionnalite = ref(false);
    let date = ref(true);
    let tri = ref();
    //=============Autorisations
    let actionFind = ref(false);
    let actionCreate = ref(false);
    let actionDelete = ref(false);
    let actionUpdate = ref(false);

    //variable permettant de stocker les niveaux de difficulté d'une tâche
    const difficulteOptions = ref([]);

    const previousPage = ref(0);
    const titre = ref("Taches");

    const query = ref({
      _where: {},
      _start: 0,
      _limit: 5,
      _sort: "id:DESC",
    });

    const pagination = ref({
      sortBy: "createdAt",
      descending: false,
      page: 0,
      rowsPerPage: 5,
      rowsNumber: 0,
    });

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
        name: "fonctionnalité",
        required: true,
        label: "Fonctionnalité",
        align: "left",
        field: (row) => row.fonctionnalite.titre,
        sortable: true,
      },
      {
        name: "poids",
        required: true,
        label: "Niveau de Difficulté",
        align: "center",
        field: (row) => row.poids,
        sortable: true,
      },
    ];

    const user = $q.sessionStorage.getItem("user");
    const token = $q.sessionStorage.getItem("token");

    onBeforeMount(() => {
      if (token === null) {
        router.push("/");
      }
    });

    const findItems = async () => {
      try {
        //query.value._where.titre_contains = filter.value

        query.value._where = {
          titre_contains: filter.value,
          // sous_tache
          // "organisation.id":
          //  user.organisations.length > 0 ? user.organisations[0].id : "",
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
        pagination.value.rowsNumber = count.data;
        items.value = res.data;
        instanceItems.value = true
        //console.log(items.value);
        //filter.value = ""

        let tabFilter = res.data;
        let trier = [];
        trier = lodash.groupBy(
          tabFilter,
          (tabFilter) => tabFilter.fonctionnalite.titre
        );
        //console.log(trier);

        grouped.value = Object.entries(trier);
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
      /*
      if (page == previousPage) {
        pagination.value.page = page - 1  
      } else {
        pagination.value.page = page + 1
      }
      */
    };

    const remove = async (item) => {
      try {
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/${item.id}`,
          method: "delete",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await findItems();
      } catch (error) {
        console.log(error);
      }
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
        //console.log(res.data);
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
        //await findItems()
        //Autorisation
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
          url: `/fonctionnalites?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fonctionnalites.value = res.data;
        //await onRequest({ pagination: pagination.value });

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
     * fonction d'ajout d'une tâche
     */
    const submitCreate = async () => {
      if (createFormRef.value.validate()) {
        createForm.value.organisation =
          user.organisations.length > 0 ? user.organisations[0].id : null;

        try {
          createForm.value.fonctionnalite = formFonctionnalite.value;
          createForm.value.fin = endOfDay(new Date(createForm.value.fin));
          let res = await instance.appContext.app.config.globalProperties.$api({
            url: `/${service}`,
            method: "post",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: createForm.value,
          });
          await findItems();
          showCreate.value = false;
          createForm.value.titre = "";
          createForm.value.fonctionnalite = null;
          createForm.value.debut = null;
          createForm.value.fin = null;
        } catch (error) {}
      } else {
      }
    };

    const onModaleye = async (id) => {
      modaleye.value = true;
      try {
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/${id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        itemTache.value = res.data;
        // console.log(itemTache.value);
        // var date1 = new Date(itemTache.value.fin);
        // var date2 = new Date(Date.now());
        // // console.log(date2)
        // // console.log(date1)
        // var Diff_temps = date1.getTime() - date2.getTime();
        // var Diff_jours = Diff_temps / (1000 * 3600 * 24);
        // tempsRestant.value = Math.round(Diff_jours)

        var datedefin = new Date(itemTache.value.fin);
        var datededebut = new Date(itemTache.value.debut);

        /**
         *  Etape 1 : verifier si la date d'expiration est déjà passé
         */
        const result = compareAsc(Date.now(), datedefin);
        const entredate = formatDistance(Date.now(), datedefin).split(" ")[0];
        if (result === -1) {
          //Date de fin pas encore passé
          const resultSecond = compareAsc(Date.now(), datededebut);
          if (resultSecond == -1) {
            //Pas encore debute
            try {
              duree.value.debutdans =
                parseInt(
                  formatDistance(Date.now(), datededebut).split(" ")[0]
                ) + 1;
            } catch (error) {
              console.log(error);
            }
            if (
              formatDistance(Date.now(), datededebut).split(" ")[0] == "about"
            ) {
              duree.value.startToday = true;
            }
            // duree.value.debutdans = parseInt(formatDistance(Date.now(), datededebut ).split(' ')[0]) + 1
            duree.value.startnext = false;
            duree.value.startIn = false;
            duree.value.expireTo = false;
            duree.value.expireToday = false;
          } else {
            // dejadebuter
            duree.value.debutdans = formatDistance(
              Date.now(),
              datededebut
            ).split(" ")[0];
            if (duree.value.debutdans == "about") {
              duree.value.startToday = true;
              duree.value.startIn = false;
              duree.value.startnext = false;
              duree.value.expireTo = false;
              duree.value.expireToday = false;
            } else {
              duree.value.startToday = false;
              duree.value.startIn = true;
              duree.value.startnext = false;
              duree.value.expireToday = false;
              duree.value.expireTo = false;
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
      } catch (error) {
        console.log(error);
      }
    };

    function confirm(id) {
      $q.dialog({
        dark: false,
        title: "Confirmation de la suppression",
        message: `Voulez vous vraiment supprimer cette la tâche <strong>${id.titre}</strong>  ?`,
        ok: {push:true, color: 'negative',flat:true},
        cancel: true,
        persistent: true,
        html: true,
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
          },
        });

        console.log('response', res);
      showUpdate.value = true;
      createForm.value.titre = res.data[0].titre
      createForm.value.id = res.data[0].id
      formFonctionnalite.value = res.data[0].fonctionnalite

    };

    const submitUpdate = async() =>{
        try {
          let id = createForm.value.id
          createForm.value.fonctionnalite = formFonctionnalite.value;
          let res = await instance.appContext.app.config.globalProperties.$api({
          url:`/${service}/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            titre: createForm.value.titre,
            fonctionnalite: createForm.value.fonctionnalite
          },
        });
        await findItems();
        showUpdate.value = false;
         
       } catch (error) {
         console.log(error);
       } 
    }

    // initialisation du tableau des niveaus de difficultés
    difficulteOptions.value = ["Facile", "Moyen", "Difficile"];

    watch(tri, async () => {
      if (tri.value.label === "Fonctionalité") {
        fonctionnalite.value = true;
        date.value = false;
      } else {
        fonctionnalite.value = false;
        date.value = true;
      }
    });

    watch(formFonctionnalite, async () => {
      //recupere la mission selectionnée
      //console.log(formFonctionnalite.value);
      if (formFonctionnalite.value) {
        const query = qs.stringify({
          _where: [{ id: formFonctionnalite.value }],
        });

        let fonctionnality =
          await instance.appContext.app.config.globalProperties.$api({
            url: `/fonctionnalites?${query}`,
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        //console.log(fonctionnality.data[0]);

        finFonctionnalite.value = format(
          new Date(fonctionnality.data[0].fin),
          "yyyy/MM/dd"
        );
        //console.log("Fin", finFonctionnalite.value);
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
          return date >= dateF && date <= finFonctionnalite.value;
        } else {
          let dateF =
            datenow.getFullYear() +
            "/" +
            (datenow.getMonth() + 1) +
            "/0" +
            datenow.getDate();
          //console.log(dateF);
          return date >= dateF && date <= finFonctionnalite.value;
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
          return date >= dateF && date <= finFonctionnalite.value;
        } else {
          let dateF =
            datenow.getFullYear() +
            "/" +
            (datenow.getMonth() + 1) +
            "/" +
            datenow.getDate();
          //console.log(dateF);
          return date >= dateF && date <= finFonctionnalite.value;
        }
      }
    };

    let fin = (date) => {
      return date >= createForm.value.debut && date <= finFonctionnalite.value;
      //return date <= '2021/09/18'
    };

    return {
      titre,
      items,
      columns,
      filter,
      remove,
      loading,
      pagination,
      fonctionnalites,
      onRequest,
      showCreate,
      onShowCreate,
      showUpdate,
      submitUpdate,
      onShowUpdate,


      onModaleye,
      modaleye,
      itemTache,
      confirm,

      createForm,
      createFormRef,
      submitCreate,
      difficulteOptions,
      bar2: ref(false),
      model: ref(),
      grouped,
      fonctionnalite,
      date,
      tri,
      duree,
      debut,
      fin,
      finFonctionnalite,
      formFonctionnalite,
      barAjax,
      instanceItems,
      options: [
        {
          label: "Date",
          value: "date",
          icon: "",
        },
        {
          label: "Fonctionalité",
          value: "fonction",
          icon: "task",
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
.my-card
  width: 100%
  max-width: 350px
q-input
  border-color: #0000ff
.demo-title
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 1
  -webkit-box-orient: vertical
  text-align: justify
</style>
