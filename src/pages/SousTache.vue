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
      <h4 v-if="titre === 'Sous Tache'">Sous-tâches</h4>
      <div class="row q-ml-sm" style="margin-bottom: 0px">
        <div class="col-md-10 col-sm-8 col-lg-10 col-xs-6">
          <q-btn
            outline
            color="primary"
            icon="add"
            label="Ajouter"
            @click="onShowCreate"
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

    <div v-if="tache === true">
      <div v-for="item in grouped_tache" :key="item">
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
            style="width: 83%; height: 2.5px"
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
                        name="bookmark_added"
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
                        <q-icon name="task_alt" color="dark" />
                        {{ list.tache.titre }}
                      </span>
                    </q-item-label>
                  </q-item>
                  <q-item class="row items-center">
                    <q-icon
                      color="negative"
                      name="event_busy"
                      style="font-size: 1.5em"
                      class="q-mr-xs"
                    />
                    {{ $FormatDates(list.fin) }}
                    <q-space />
                  </q-item>
                </q-card-section>
                <q-linear-progress
                  rounded
                  :value="list.progression / 100"
                  :buffer="1.0"
                  color="primary"
                  track-color="teal-2"
                  class="q-mt-sm"
                />
                <q-card-actions dense align="right">
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
                    @click="onShowUpdate(list.id)"
                    v-if="actionUpdate"
                  />
                  <q-btn
                    flat
                    color="negative"
                    icon="delete"
                    @click="confirm(list)"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </q-list>
        </div>
      </div>
    </div>

    <div v-if="users === true">
      <div v-for="item in grouped_user" :key="item">
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
            style="width: 83%; height: 2.5px"
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
                        name="bookmark_added"
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
                        <q-icon name="task_alt" color="dark" />
                        {{ list.tache.titre }}
                      </span>
                    </q-item-label>
                  </q-item>
                  <q-item class="row items-center">
                    <q-icon
                      color="negative"
                      name="event_busy"
                      style="font-size: 1.5em"
                      class="q-mr-xs"
                    />
                    {{ $FormatDates(list.fin) }}
                    <q-space />
                  </q-item>

                </q-card-section>
                <q-linear-progress
                  rounded
                  :value="list.progression / 100"
                  :buffer="1.0"
                  color="primary"
                  track-color="teal-2"
                  class="q-mt-sm"
                />
                <q-card-actions dense align="right">
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
                    @click="onShowUpdate(list.id)"
                    v-if="actionUpdate"
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
        <div class="" style="margin-top: 65px; margin-bottom: 25px">
          <q-btn-dropdown
            flat
            color="primary"
            size="12px"
            dropdown-icon="expand_more"
          />

          Toutes les sous tâches

          <q-separator
            class="float-right q-mt-md"
            color="primary"
            style="width: 83%; height: 2.5px"
          />
        </div>

        <div class="row">
          <q-list v-for="list in items" :key="list">
            <div class="col-md-4 col-sm-6 col-lg-3 q-pa-xs">
              <q-card
                class="border-radius-2 shadow-3 q-ma-xs"
                style="width: 350px; max-width: 350px"
              >
                <q-card-section>
                  <q-item class="q-pa-xs">
                    <q-item-section avatar class="self-start">
                      <q-icon
                        name="bookmark_added"
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
                        <q-icon name="task_alt" color="dark" />
                        {{ list.tache.titre }}
                      </span>
                    </q-item-label>
                  </q-item>
                  <q-item class="row items-center">
                    <q-icon
                      color="negative"
                      name="event_busy"
                      style="font-size: 1.5em"
                      class="q-mr-xs"
                    />
                    {{ $FormatDates(list.fin) }}
                    <q-space />
                  </q-item>
                </q-card-section>
                <q-linear-progress
                  rounded
                  :value="list.progression / 100"
                  :buffer="1.0"
                  color="primary"
                  track-color="teal-2"
                  class="q-mt-sm"
                />
                <q-card-actions dense align="right">
                  <span class="text-weight-light text-italic text-grey-7"  >créer par {{list.user.prenom}}</span>
                  <q-space />
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
                    @click="onShowUpdate(list.id)"
                    v-if="actionUpdate"
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

    <!-- retour si items est vide -->
    <div v-if="instanceItems === true && items.length === 0" style="text-align: center">
      <p class="q-ma-md text-h6 text-grey">Aucune sous-tâche trouvée</p>
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
            <img src="icons/bookmark.svg" />
          </q-avatar>

          <q-toolbar-title
            >Ajouter
            <span class="text-weight-bold"
              >une Sous-tâche</span
            ></q-toolbar-title
          >

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="">
          <q-form ref="createFormRef" @submit="submitCreate">
            <q-input
              label="Titre"
              v-model="createForm.titre"
              :rules="[(val) => !!val || 'Merci de choisir une sous-tâche']"
            />

            <q-select
              v-model="formTache"
              :options="taches"
              option-value="id"
              option-label="titre"
              emit-value
              map-options
              :rules="[(val) => !!val || 'Merci de choisir une tâche']"
              label="Tâches"

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

            <q-card-actions dense vertical align="right">
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

    <q-dialog
      v-model="modaleye"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up"
      >
      <q-card class="my-card" style="width: 700px; max-width: 70vw">
        <q-card-section class="no-wrap items-center text-h6 ellipsis">
          <q-icon
            name="bookmark_added"
            color="primary"
            style="font-size: 2.4em"
          />
          <!-- <img src="icons/tick.svg" style="font-size: 2.4em;"/> -->
          {{ itemSousT.titre }}
          <q-btn
            class="absolute-top-right"
            color="negative"
            flat
            round
            icon="close"
            v-close-popup
          />
        </q-card-section>
        <q-card-section class="justify-center">
          <div class="row justify-evenly">
            <div class="col-4">
              <q-icon name="event" size="sm" color="" /> Depuis le
              {{ $FormatDates(itemSousT.debut) }}
            </div>
            <div class="col-4">
              <q-icon name="event_available" size="sm" color="green-10" />
              Jusqu'à {{ $FormatDates(itemSousT.fin) }}
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
                a {{ duree.finitdans }}
                jours
              </span>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-linear-progress
            size="lg"
            :value="itemSousT.progression / 100"
            :buffer="1.0"
            color="primary"
            track-color="teal-2"
            class="q-mt-sm"
            stripe
            rounded
          >
          </q-linear-progress>
          <div
            class="flex flex-center q-mt-md"
            color="primary"
            style="max-heigth: 60%"
          >
            <q-badge
              color="white"
              text-color="primary"
              :label="itemSousT.progression + '% terminée'"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

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
            <img src="icons/bookmark.svg" />
          </q-avatar>

          <q-toolbar-title
            >Modifier
            <span class="text-weight-bold"
              >la Sous-tâche</span
            ></q-toolbar-title
          >

          <q-btn flat round dense icon="close" color="negative" v-close-popup />
        </q-toolbar>
        <q-card-section class="">
          <q-form ref="createFormRef" @submit="submitUpdate()">
            <q-input
              label="Titre"
              v-model="createForm.titre"
              :rules="[(val) => !!val || 'Merci de choisir une sous-tâche']"
            />

            <q-select
              v-model="formTache"
              :options="taches"
              option-value="id"
              option-label="titre"
              emit-value
              map-options
              :rules="[(val) => !!val || 'Merci de choisir une tâche']"
              label="Tâches"
            />

            <q-card-actions dense vertical align="right">
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
import {
  defineComponent,
  onMounted,
  getCurrentInstance,
  ref,
  watch,
  onBeforeMount,
} from "vue";
import { endOfDay, compareAsc, formatDistance, format } from "date-fns";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const $q = useQuasar();
    const instance = getCurrentInstance();
    const router = useRouter();
    const items = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const service = "sous-taches";
    const showCreate = ref(false);
    const showUpdate = ref(false)
    const modaleye = ref(false);
    const itemSousT = ref({});
    const duree = ref({});
    const createForm = ref({
      debut: new Date(),
      fin: endOfDay(new Date()),
    });
    const createFormRef = ref();
    let formTache = ref();
    let finTache = ref();
    const barAjax = ref(null)
    let instanceItems = ref(false);

    const previousPage = ref(0);
    const titre = ref("Sous Tache");

    const taches = ref([]);

    let grouped_tache = ref([]);
    let grouped_user = ref([]);
    let tache = ref(false);
    let date = ref(true);
    let users = ref(false);
    let tri = ref();

      //=============Autorisations
    let actionFind = ref(false);
    let actionCreate = ref(false);
    let actionDelete = ref(false);
    let actionUpdate = ref(false);

    const query = ref({
      _where: {},
      _start: 0,
      _limit: 10,
      _sort: "id:DESC",
    });

    const pagination = ref({
      sortBy: "createdAt",
      descending: false,
      page: 0,
      rowsPerPage: 10,
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
        name: "tache",
        required: true,
        label: "Tache",
        align: "left",
        field: (row) => row.tache.titre,
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
        //query.value._limit = pagination.value.rowsPerPage
        if (user.role.name === "Admin" || "Chef") {
          query.value._where = {
            titre_contains: filter.value,
            completed: false,
          };
        }
        if(user.role.name === "Standart") {
          query.value._where = {
            titre_contains: filter.value,
            completed: false,
            "user.id": user.id,
          };
        }

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
        //console.log("items.value",items.value);
        instanceItems.value = true

        let tabFilter = res.data;
        let tri_tache = [];
        tri_tache = lodash.groupBy(
          tabFilter,
          (tabFilter) => tabFilter.tache.titre
        );
        //console.log(tri_tache);

        grouped_tache.value = Object.entries(tri_tache);

        let tri_user = [];
        tri_user = lodash.groupBy(
          tabFilter,
          (tabFilter) => tabFilter.user.username
        );
        //console.log(tri_user);

        grouped_user.value = Object.entries(tri_user);
        //filter.value = ""
      } catch (error) {
        console.log(error);
      }
    };

    const onRequest = async (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      // <q-icon name="bar_chart"   color="primary"  style="font-size: 2.4em;"/> <span class="text-h5 text-weight-bold demo-title text-primary demo-title"> {{p.r
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
    /**
     * confirmation de la suppression
     */
    function confirm(id) {
      $q.dialog({
        dark: false,
        title: "Confirmation de la suppression",
        message: `Voulez vous vraiment supprimer cette la sous-tâche <strong>${id.titre}</strong>?`,
        ok: { push: true, color: "negative", flat: true },
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
    /**
     * supression d'une fonctionnalité
     */
    const remove = async (item) => {
      const token = $q.sessionStorage.getItem("token");
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
        actionFind.value = await autorisation("find");
        actionCreate.value = await autorisation("create");
        actionDelete.value = await autorisation("delete");
        actionUpdate.value = await autorisation("update");
        //await findItems()
      if (token) {
        const token = $q.sessionStorage.getItem("token");

        let params = qs.stringify({
          _where: {
            completed: false,
          },
          _start: 0,
          _limit: 1000,
          _sort: "createdAt:DESC",
        });

        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/taches?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        taches.value = res.data;
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
      showUpdate.value = true;
      createForm.value.titre = res.data[0].titre
      createForm.value.id = res.data[0].id
      formTache.value = res.data[0].tache
    };
    /**
     * fonction d'ajout d'une sous tâche
     */

    const submitCreate = async () => {
      // let debut = format(new Date(createForm.value.debut), 'yyyy-MM-dd')
      //   createForm.value.debut = debut

      // createForm.value.debut = `2021-08-19`
      // createForm.value.fin = `2021-08-19`

      createForm.value.user = user.id;
      // console.log('resulte | ',createForm.value);
      // console.log('test de date | ', new Date(createForm.value.debut));

      try {
        //conversion de chainde caractère en date pour postgree
        createForm.value.tache = formTache.value;
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
      } catch (error) {
        console.log(error);
      }
      console.log("createForm.value |", createForm.value);
      // vider formulaire
      createForm.value.titre = "";
      createForm.value.debut = null;
      createForm.value.fin = null;
    };

    const submitUpdate = async () => {
       try {
          let id = createForm.value.id
          createForm.value.tache = formTache.value;
          let res = await instance.appContext.app.config.globalProperties.$api({
          url:`/${service}/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            titre: createForm.value.titre,
            tache: createForm.value.tache
          },
        });
        await findItems();
        showUpdate.value = false;

       } catch (error) {
         console.log(error);
       }

    }

    /**
     * fonction d'activatioin de detail
     */

    let onModaleye = async (id) => {
      modaleye.value = true;
      const token = $q.sessionStorage.getItem("token");
      try {
        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/${service}/${id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        itemSousT.value = res.data;
        var datedefin = new Date(itemSousT.value.fin);
        var datededebut = new Date(itemSousT.value.debut);

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
              //  console.log("duree.value.finitdans",formatDistance(Date.now(), datedefin));
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
        // console.log(date2)
        // // console.log(date1)
        // console.log('result |', result)
        //   var Diff_temps = date1.getTime() - date2.getTime();
        //   var Diff_jours = Diff_temps / (1000 * 3600 * 24);
        //   tempsRestant.value = Math.round(Diff_jours)
        //  console.log(itemSousT.value);
        /**
         *  si result est égale à 1 c'est que la date debut n'est pas encore arriver
         *  le cas échéant, c'est que la date debut est arrivé
         */
        // if (result.value === -1) {
        //   console.log('result | ', result.value)
        //   console.log('déjà arriver| ')
        //   //verification si la datelimite est déjà passé
        //   // if(){
        //    const resultSecond = compareAsc(new Date(itemSousT.value.fin), new Date(Date.now()))
        //   console.log('resultat pour verifier si la date de fin est déja passé ou pas | ', resultSecond)
        //   // }
        //   // l'on déterminera le temps restant
        //   tempsRestant.value = formatDistance(datededebut, datedefin ).split(' ')[0]
        //   console.log('tempsRestant.value | ', tempsRestant.value)
        // } else {
        //   // l'on déterminera seulement la durée de la tâches
        //   tempsRestant.value = formatDistance(datededebut, datedefin ).split(' ')[0]
        //   console.log('tempsRestant.value | ', tempsRestant.value)
        //   console.log('result | ', result.value)
        //   console.log('pas encore arriver| ')
        // }
      } catch (error) {
        console.log(error);
      }
    };

    watch(tri, async () => {
      switch (tri.value.label) {
        case "Tache":
          tache.value = true;
          users.value = false;
          date.value = false;
          break;

        case "Développeur":
          users.value = true;
          date.value = false;
          tache.value = false;
          break;

        case "Date":
          date.value = true;
          tache.value = false;
          users.value = false;
          break;

        default:
      }
    });

    watch(formTache, async () => {
      //recupere la mission selectionnée
      console.log(formTache.value);
      if (formTache.value) {
        const query = qs.stringify({
          _where: [{ id: formTache.value }],
        });

        let resTache =
          await instance.appContext.app.config.globalProperties.$api({
            url: `/taches?${query}`,
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        console.log(resTache.data[0]);

        finTache.value = format(new Date(resTache.data[0].fin), "yyyy/MM/dd");
        //console.log("Fin", finTache.value);
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
          return date >= dateF && date <= finTache.value;
        } else {
          let dateF =
            datenow.getFullYear() +
            "/" +
            (datenow.getMonth() + 1) +
            "/0" +
            datenow.getDate();
          //console.log(dateF);
          return date >= dateF && date <= finTache.value;
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
          return date >= dateF && date <= finTache.value;
        } else {
          let dateF =
            datenow.getFullYear() +
            "/" +
            (datenow.getMonth() + 1) +
            "/" +
            datenow.getDate();
          //console.log(dateF);
          return date >= dateF && date <= finTache.value;
        }
      }
    };

    let fin = (date) => {
      return date >= createForm.value.debut && date <= finTache.value;
    };

    return {
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
      showCreate,
      onShowCreate,
      showUpdate,
      onShowUpdate,
      taches,
      itemSousT,
      createForm,
      createFormRef,
      submitCreate,
      confirm,
      submitUpdate,
      duree,
      grouped_tache,
      grouped_user,
      tache,
      users,
      date,
      tri,
      debut,
      fin,
      finTache,
      formTache,
      barAjax,
      instanceItems,
      options: [
        {
          label: "Date",
          value: "date",
          icon: "event",
        },
        {
          label: "Tache",
          value: "tache",
          icon: "task_alt",
        },
        {
          label: "Développeur",
          value: "developpeur",
          icon: "people_alt",
        },
      ],

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
