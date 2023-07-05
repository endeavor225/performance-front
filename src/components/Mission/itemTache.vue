<template>
  <div>
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      horizontal
      control-color="teal-10"
      arrows
      height="70vh"
      prev-icon="arrow_left"
      next-icon="arrow_right"
      navigation-icon="radio_button_unchecked"
      class="bg-teal-1"
      style="min-width: 100%"
      v-if="taches.length !== 0"
      v-model:fullscreen="fullscreen"
    >
      <!-- <sous-tache v-for="item in itemTache" :key="item" :itemSousTache="item" /> -->
      <q-carousel-slide
        v-for="(itemTaches, index) in taches"
        :key="itemTaches"
        :name="itemTaches.id"
        style="width: 100%; height: 0"
        class=""
      >
        <div class="q-ml-md">
          <div class="text-left items-end q-mt-md q-ml-md text-teal-10">
            <q-avatar square size="md" class="q-mr-md">
              <img src="icons/tick.svg" />
            </q-avatar>
            <span class="text-capitalize text-weight-bold text-h4">
              {{ itemTaches.titre }}
              <span class="text-body text-weight-light">
                ( Fini
                {{ itemTaches.fonctionnalite.fin }} )
              </span>
            </span>
          </div>
          <div class="q-mt-md q-mt-sm q-pl-lg text-teal-10 text-h5">
            Sous-taches ({{ itemTaches.sous_taches.length }})
          </div>
        </div>
        <q-scroll-area
          class="q-mx-auto q-pa-lg fit justify-center"
          style="max-height: 70%; max-width: 90%"
        >
          <div
            v-for="itemSousTache in itemTaches.sous_taches"
            :key="itemSousTache"
          >
          <q-separator />
            <q-item >
              <q-item-section>
                <span class="text-weight-bold text-grey-10">
                {{ itemSousTache.titre }}
                </span>
              </q-item-section>
              <q-item-section>
                <q-linear-progress
                :value="itemSousTache.progression /100 < 0 ?  0 : itemSousTache.progression /100"
                rounded
                color="grey-10"
                track-color="grey-8"
                size="70%"
              />
              </q-item-section>
              <q-item-section>
                <span class="text-grey-8">
                finit {{ itemTaches.fonctionnalite.fin }}
                </span>
              </q-item-section>
              <q-item-section>
                créer par
                {{ itemSousTache.user.nom }} {{ itemSousTache.user.prenom }}
              </q-item-section>
            </q-item>
          </div>
        </q-scroll-area>
        <div
          class="
            absolute-bottom
            q-mx-lg
            row
            items-center
            justify-between
            q-pb-sm q-mb-md
          "
        >
          <div class="text-h6 col-5">
            <q-avatar square size="md">
              <img src="icons/completed-task.svg" />
            </q-avatar>
            Fonctionnalité:
            <span class="text-italic text-capitalize text-h5"
              >{{ itemTaches.fonctionnalite.titre }}
            </span>
          </div>
          <div class="text-right text-h6 col-6 text-grey-7">
            <span class="text-uppercase">
              {{ index + 1 }} / {{ taches.length }}
            </span>
          </div>
        </div>
      </q-carousel-slide>
      <template v-slot:control>
        <q-carousel-control position="top-right" :offset="[18, 18]">
          <q-btn
            flat
            round
            outline
            color="teal-10"
            text-color="teal-10"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="fullscreen = !fullscreen"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
    <div v-else class="text-h4 text-center text-uppercase">pas de taches</div>
  </div>
</template>

<script>
import qs from "qs";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ref, onMounted, getCurrentInstance } from "vue";
import { useQuasar } from "quasar";
// import sousTache from "src/components/Mission/itemSousTache.vue";
export default {
  props: {
    itemTache: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  // components: {
  //   sousTache,
  // },
  setup(props) {
    const $q = useQuasar();
    let taches = ref([]);
    let slide = ref();
    let dateResult = ref();

    if (props.itemTache.length !== 0) {
      slide.value = props.itemTache[0].id;
    }

    onMounted(async () => {
      const instance = getCurrentInstance();
      const user = $q.sessionStorage.getItem("user");
      const token = $q.sessionStorage.getItem("token");

      const query = ref({
        _where: {},
      });

      if (props.itemTache.length !== 0) {
        query.value._where = {
          fonctionnalite: props.itemTache[0].fonctionnalite,
        };

        let params = qs.stringify(query.value);

        let res = await instance.appContext.app.config.globalProperties.$api({
          url: `/taches?${params}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        taches.value = res.data;
        taches.value.forEach((t) => {
          console.log("t |", t.sous_taches);
          if (t.sous_taches.length !== 0) {
            t.sous_taches.forEach(async (st) => {
              let user =
                await instance.appContext.app.config.globalProperties.$api({
                  url: `/users/${st.user}`,
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
              st.user = user.data;
              console.log(" st |", user.data);
            });
          }
        });

        for (const itemSous of taches.value) {
          for (const dateSous of itemSous.sous_taches) {
            // dateResult.value = formatDistanceToNow(new Date(dat.fin), {
            //   addSuffix: true,
            //   locale: fr,
            // });

            dateSous.fin = formatDistanceToNow(new Date(dateSous.fin), {
              addSuffix: true,
              locale: fr,
            });
          }

          itemSous.fonctionnalite.fin = formatDistanceToNow(
            new Date(itemSous.fonctionnalite.fin),
            {
              addSuffix: true,
              locale: fr,
            }
          );
        }
      }
    });

    return {
      slide,
      taches,
      dateResult,
      fullscreen: ref(false),
    };
  },
};
</script>

<style lang="scss" scoped></style>
