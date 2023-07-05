<template>

    <!-- content -->
    <div>
      <q-table
        grid
        style="display: none"
        :columns="columns"
        row-key="id"
        :filter="filter"
        hide-header
        v-model:pagination="pagination"
        @request="onRequest"
        :loading="loading"
        binary-state-sort
      >
         
      </q-table>

      <div style="margin-top: -20px">
        <h4 v-if="titre === 'Évaluation du jour'">Évaluations du jour</h4>
      </div>
      <div class="row justify-between">
        <div class="col-6">
          <q-btn
            outline
            color="primary"
            icon="add"
            label="Ajouter"
            @click="onShowCreate"
          />
        </div>
        <div class="col-2 self-end">
          <q-input v-model="filter" label="Recherche" dense>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-mt-lg">

        <q-list v-for="item in items"
                :key="item.id" >
           <div class="col-md-4 col-sm-6 col-lg-3 q-pa-xs">
              <q-card
                class="row inline"
                
                style="width: 5erm"
              >
                <q-card-section class="row items-center" horizontal>
                  <q-card-section>
                    <q-icon
                      name="bar_chart"
                      color="primary"
                      style="font-size: 2.4em"
                    />
                    <span
                      class="
                        text-h5 text-weight-bold
                        demo-title
                        text-primary
                        demo-title
                      "
                    >
                      {{ item.sous_tache.titre }}</span
                    >
                    <div>
                      <span class="text-grey-10">
                        <q-icon name="event" class="q-mr-xs" color="grey-10" />
                        {{ $FormatDates(item.published_at) }}
                      </span>
                    </div>
                  </q-card-section>

                  <q-card-section class="">
                    <q-circular-progress
                      show-value
                      font-size="12px"
                      :value="item.sous_tache.progression"
                      size="50px"
                      :thickness="0.2"
                      color="teal-9"
                      track-color="light-green-1"
                      class="q-ma-md"
                    >
                      {{ item.sous_tache.progression }}%
                    </q-circular-progress>
                  </q-card-section>
                </q-card-section>
              </q-card>
           </div>
        </q-list>
      </div>
      <div v-if="instanceItems === true && items.length === 0" style="text-align: center; margin-top:30px">
      <!-- <q-icon name="mood_bad" class="q-ma-md text-h6 text-grey" style="font-size: 4rem;" /> -->
      <p class="q-ma-md text-h6 text-grey">Aucune sous-tâche trouvée</p>
    </div>
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
            <img src="icons/bar-graph.svg" />
          </q-avatar>

          <q-toolbar-title
            >Ajouter
            <span class="text-weight-bold"
              >une évaluation</span
            ></q-toolbar-title
          >

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="">
          <q-form ref="createFormRef" @submit="submitCreate">
            <!-- <q-input
              label="Poucentage"
              type="number"
              v-model="createForm.poucentage"
              :rules="[
                (val) => val <= 100 || 'Le pourcentage ne peut pas excéder 100',
                (val) => val > 0 || 'Le pourcentage ne peut pas être inferieur à 0',
              ]"
            /> -->
            <q-card-section>
              <!-- Lorem ipsum dolor sit amet -->
              <q-select
                v-model="sous_tache_item"
                :options="sous_taches"
                option-value="id"
                option-label="titre"
                emit-value
                map-options
                :rules="[(val) => !!val || 'Merci de choisir une sous-tâche']"
              />
            <!-- </q-card-section>
            <q-card-section> -->
              <!-- Lorem ipsum dolor sit amet -->
            <div class="row justify-center">

                <q-badge
                class="mx-auto"
                  color="white"
                  text-color="primary"
                  :label="progressCurrent + '% terminée'"
                />
            </div>
              
              <q-linear-progress
                size="lg"
                :value="progressCurrent / 100"
                :buffer="1.0"
                color="primary"
                track-color="teal-2"
                class="q-mt-sm"
                stripe
              >
              </q-linear-progress>
            </q-card-section>
            <q-card-section class="q-pt-lg">
              <q-slider
                v-model="evaluation"
                :min="0"
                :max="progressionMax"
                :step="1"
                label
                :label-value="evaluation + `% réalisés aujourd'hui`"
                label-always
                color="primary"
              />

              <!-- Lorem ipsum dolor sit amet -->
            </q-card-section>
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
    <q-dialog v-model="modaleye">
      <q-card style="width: 40%; height: 35%">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1">Information Sous Tache</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-red" />
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle2">
            Sous Tache: {{ itemEvaluation.sous_tache.titre }}
          </div>
          <div class="col-auto text-grey-8 text-caption q-pt-md">
            Date Evaluation:
            {{ $FormatDate(itemEvaluation.createdAt) }} Progression:
            {{ itemEvaluation.poucentage }}%
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-ajax-bar
      ref="barAjax"
      position="top"
      color="accent"
      size="10px"
      skip-hijack
    />

</template>

<script>
import qs from "qs";
import { useQuasar } from "quasar";
import {
  defineComponent,
  onMounted,
  getCurrentInstance,
  ref,
  onBeforeMount,
  watch,
} from "vue";
// import fr from "apexcharts/dist/locales/fr.json";
import { format, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const $q = useQuasar();
    const instance = getCurrentInstance();
    const router = useRouter();
    const items = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const service = "poucentage-sous-taches";
    const showCreate = ref(false);

    const modaleye = ref(false);
    const itemEvaluation = ref({});
    const createForm = ref({});
    const createFormRef = ref();

    const previousPage = ref(0);
    const titre = ref("Évaluation du jour");

    const sous_taches = ref([]);

    const sous_tache_item = ref();
    const evaluation = ref();
    const progressionMax = ref();
    const progressCurrent = ref(0);

    const barAjax = ref(null)
    let instanceItems = ref(false);

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

    // ne pas toucher cette variable elle permet de reinitialiser la bar de choix

    evaluation.value = 0;

    const columns = [
      {
        name: "titre",
        required: true,
        label: "Titre",
        align: "left",
        field: (row) => row.sous_tache.titre,
        sortable: true,
      },
      {
        name: "poucentage",
        required: true,
        label: "Pourcentage",
        align: "left",
        field: (row) => row.poucentage,
        sortable: true,
      },
      {
        name: "createdAt",
        required: true,
        label: "Date",
        align: "left",
        field: (row) =>
          format(new Date(row.createdAt), "EEEE dd MMMM yyyy", { locale: fr }),
        sortable: true,
      },
      {
        name: "tache",
        required: true,
        label: "Tache",
        align: "left",
        field: (row) => row.sous_tache.tache,
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

    const getTache = async (a) => {
      for (const key in a) {
        console.log("id de tache | ", a[key].sous_tache.tache);
        const id = a[key].sous_tache.tache;
        query.value._where = {
          id: id,
        };
        let param = qs.stringify(query.value);
        let ress = await instance.appContext.app.config.globalProperties.$api({
          url: `/taches?${param}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //console.log('resutat de ma requete | ',ress.data[0])
        a[key].sous_tache.tache = ress.data;
      }
    };
    const findItems = async () => {
      try {
        query.value._where = {
          "sous_tache.titre_contains": filter.value,
          "sous_tache.user.id": user.id,
        };

        //query.value._where['sous_tache.titre_contai
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
        getTache(items.value);
        //filter.value = ""
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

    const remove = async (id) => {
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

    onMounted(async () => {
      //await findItems()
      if (token) {
        let params = qs.stringify({
          _where: {
            completed: false,
            "user.id": user.id,
          },
          _start: 0,
          _limit: 1000,
          _sort: "createdAt:DESC",
        });

        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/sous-taches?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        sous_taches.value = res.data;
        /* let ress = await instance.appContext.app.config.globalProperties.$api({
          url: `/taches?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });*/
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

    const submitCreate = async () => {
      if (createFormRef.value.validate()) {
        //createForm.value.user = user.id
        createForm.value.poucentage = evaluation.value
        createForm.value.sous_tache = sous_tache_item.value
        let to_day = new Date();
        let start_day = startOfDay(to_day);
        let end_day = endOfDay(to_day);

        try {
          console.log(createForm.value.sous_tache);
          let params = qs.stringify({
            _where: {
              "sous_tache.id": createForm.value.sous_tache,
              createdAt_gte: start_day,
              createdAt_lte: end_day,
            },
            _start: 0,
            _limit: 1,
            _sort: "createdAt:DESC",
          });

          let res = await instance.appContext.app.config.globalProperties.$api({
            url: `/${service}?${params}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.data.length === 0) {
            let res =
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
            sous_tache_item.value = null;
          } else {
            instance.ctx.$q.notify({
              type: "negative",
              position: "top-right",
              timeout: 2500,
              message: "vous avez déjà évalué cette sous tâche aujourd'hui",
            });
            showCreate.value = false;
          }
        } catch (error) {
          console.log(error);
        }
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

        itemEvaluation.value = res.data;
        console.log(itemEvaluation.value);
      } catch (error) {
        console.log(error);
      }
    };
    watch(sous_tache_item, async () => {
      //recupere la mission selectionnée
      console.log(sous_tache_item.value);
      sous_taches.value.forEach((element) => {
        if (element.id == sous_tache_item.value) {
          console.log(element.progression);
          progressionMax.value = 100 - element.progression;
          progressCurrent.value = element.progression;
          evaluation.value = 0;
        }
      });
      // if (formTache.value) {
      //   const query = qs.stringify({
      //     _where: [{ id: formTache.value }],
      //   });

      //   let resTache =
      //     await instance.appContext.app.config.globalProperties.$api({
      //       url: `/taches?${query}`,
      //       method: "get",
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     });
      //   console.log(resTache.data[0]);

      //   finTache.value = format(new Date(resTache.data[0].fin), "yyyy/MM/dd");
      //   //console.log("Fin", finTache.value);
      // }
    });
    return {
      progressCurrent,
      progressionMax,
      evaluation,
      sous_tache_item,
      titre,
      items,
      columns,
      filter,
      remove,
      loading,
      pagination,
      onRequest,
      showCreate,
      onShowCreate,
      sous_taches,
      onModaleye,
      modaleye,
      itemEvaluation,
      createForm,
      createFormRef,
      submitCreate,
      barAjax,
      instanceItems,
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
</style>
