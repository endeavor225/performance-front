<template>
  <div class="col-md-5 col-sm-5 col-lg-5 q-pa-sm">
    <!-- <q-card class="my-card scroll" style="height:400px" >
        <q-card-section horizontal class="q-pt-xs"  >
          <q-card-section class="" style="width:100%">
            <div class="text-overline text-h6"> Titre:</div>
            <div class=" q-mt-sm q-mb-xs text-weight-medium"> {{ itemListe.titre}}</div>
            <div class="text-overline text-h6 "> Description:</div>
            <div class="text-weight-light  q-mb-xs"> {{ itemListe.description}}</div>
            <div class="text-overline "> Fonctionnalites:</div>
            <q-list v-if="itemListe.fonctionnalites.length!=0"  bordered class="rounded-borders" >
              <q-item-section  class="text-weight-light  col-md-4 col-sm-4" v-for="item in fonctions" :key="item.id">
                <q-expansion-item expand-separator>
                    <template v-slot:header >
                        <q-item-section>
                            {{item.titre}}
                          </q-item-section>
                    </template>
                    <q-card>
                    <div class="text-overline text-h6" v-if="item.taches.length!=0" >  Taches:</div>
                       <div class="text-caption text-italic text-grey-8" v-else >  pas de Taches</div>
                        <q-list  class="rounded-borders "  bordered  v-for="tache in item.taches" :key="tache.id">
                          <q-expansion-item
                            expand-separator
                          >
                          <template v-slot:header>
                            <q-item-section>
                            {{tache.titre}}
                            </q-item-section>
                          </template>

                            <q-card >
                              <div v-for="items in taches" :key='items.id'>
                                 <q-item-section v-if="items.id === tache.id" >
                                  <div class="text-overline text-h6" v-if="items.sous_taches.length!=0" >  Sous Taches:</div>
                                  <div class="text-caption text-italic text-grey-8" v-else >  Pas de sous taches</div>
                                   <q-list  class="rounded-borders " v-for="j in items.sous_taches" :key="j.id" style="margin-left:10px">
                                     <span >  {{j.titre}}</span>
                                    </q-list>
                                  </q-item-section>  
                              </div>
                            </q-card>
                      </q-expansion-item>
                   
                      </q-list>
                    </q-card>
                </q-expansion-item>
                 <q-separator />
              </q-item-section>
                
            </q-list>
            <div class="text-caption text-italic text-grey-8" v-else> pas de fonctionnalité</div>

          </q-card-section>
        </q-card-section>
      </q-card> -->

    <q-card class="q-mt-md card-extra column no-border-radius no-box-shadow" style="height: 30vh">
      <q-toolbar class="bg-primary text-white col-2">
        <q-toolbar-title>{{ itemListe.titre }}</q-toolbar-title>
      </q-toolbar>
      <q-card-section class="col-7">
        <q-card-section top>
          Descriptionddsf
          <q-separator spaced size="0.1em" style="width: 70%" />
          <q-item-label caption class="ellipsis-3-lines">
            {{ itemListe.description }}</q-item-label
          >
        </q-card-section>
      </q-card-section>
      <q-card-section class="col q-px-xs">
        <div class="row">
          <q-item-section class="col">
            <q-chip size="sm" class="float-right">
              <q-avatar color="primary" text-color="white">{{
                itemListe.fonctionnalites.length
              }}</q-avatar>
              <span class="ellipsis"> Fonctionalité(s) </span>
            </q-chip>
          </q-item-section>
          <q-item-section class="col ellipsis">
            <q-chip size="sm" class="float-right">
              <q-avatar color="primary" text-color="white">{{
                taches.length
              }}</q-avatar>
              <span class="ellipsis"> Tâches </span>
            </q-chip>
          </q-item-section>
          <q-item-section class="col ellipsis">
            <q-chip size="sm" class="float-right">
              <q-avatar color="primary" text-color="white">{{
                taches.sous_taches
              }}</q-avatar>
              <span class="ellipsis"> Sous-tâches </span>
            </q-chip>
          </q-item-section>
          <q-item-section class="col-auto"
            >
            <!-- <router-link to="detail" style="text-decoration:none"><q-btn
              flat
              color="primary"
              size="sm"
              label="Voir plus"
              padding="0px  10px 0px 10px"
            /></router-link> -->
            <q-btn color="primary" label="voir plus" @click="onVisible(itemListe)" />
            </q-item-section>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="visible" full-width>
      <q-card>
        <detail-mission :itemDetail="itemListe"/>

      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import formatISO from "date-fns/fp/formatISO";
import qs from "qs";
import { useQuasar } from 'quasar'
import { defineComponent, onMounted, getCurrentInstance, ref } from "vue";
import detailMission from "./ShowdetailMission.vue";
export default defineComponent({
  // name: 'ComponentName',
  components: {
    detailMission
  },
  props: {
    itemListe: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const $q = useQuasar()
    let visible = ref(false)
    let fonctions = ref([]);
    let taches = ref([]);
    let sousTaches = ref([]);
    const instance = getCurrentInstance();

    const query = ref({
      _where: {},
      _start: 0,
      _sort: "id:DESC",
    });

    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')

    onMounted(async () => {
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
      
    });

    let onVisible = (itemListe) => {
      visible.value = true

    }

    return {
      fonctions,
      taches,
      sousTaches,
      visible,
      onVisible
    };
  },
});
</script>
<style lang="sass" scoped>
.card-extra
  border-style: solid
  border-color: #1976D2
  border-width: 1px
</style>
