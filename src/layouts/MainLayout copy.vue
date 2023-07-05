<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="text-primary"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-primary">
          Performance
        </q-toolbar-title>

        
        <div>
          <q-btn-dropdown
            dense
            flat
            style="font-size: 0.8rem"
            color="primary"
            round
          >
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-btn dense flat round icon="notifications">
                <q-badge color="red" floating> {{compteur}} </q-badge>
              </q-btn>
              </div>
            </template>

          <q-infinite-scroll @load="onLoad" :offset="10" style="max-height: 350px; width: 350px" v-if="notifications.length > 0">
            <!-- <q-scroll-area 
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              style="height: 500px; width: 360px;"> -->
              <q-list bordered separator v-for="item in notifications" :key="item"> 
               
                <div class="col-12">
                  <q-item clickable v-ripple @click="onLire(item)" :class="{'bg-teal-1': !item.lu}" >
                    <q-item-section>
                      <q-item-label caption lines="3" >
                        <q-avatar size="8px" :color="item.color"/> {{item.titre}}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>
                        {{$FormatDater(item.createdAt)}}
                      </q-item-label>
                      <q-item-label caption>
                        {{$FormatHeure(item.createdAt)}}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <q-separator inset="item" />
              </q-list>
            <!-- </q-scroll-area> -->
              <template v-slot:loading>
                <div class="row justify-center">
                  <q-spinner-dots color="primary" size="30px" />
                </div>
              </template>
            </q-infinite-scroll>

            <q-infinite-scroll style="width: 350px"  v-else>
              <div class="row justify-center q-ma-md text-caption1 text-grey">
                Aucune notification
              </div>
            </q-infinite-scroll>
          </q-btn-dropdown>

        </div>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="300"
      class="q-pa-md bg-bleuligth"
    >
        <q-scroll-area class="fit bg-primary menu-style ">
            <q-list padding class="menu-list q-mt-lg q-ml-lg">

              <a @click="$router.push('/dashboard')" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  :active="link === '/dashboard'"
                  @click="link = '/dashboard'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="speed" />
                  </q-item-section>
                  <q-item-section>
                    Tableau de bord
                  </q-item-section>
                </q-item>
              </a>

              <a @click="$router.push('/recapulatif')" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  :active="link === '/recapulatif'"
                  @click="link = '/recapulatif'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="auto_stories" />
                  </q-item-section>
                  
                  <q-item-section>
                    Liste des Missions
                  </q-item-section>
                </q-item>
              </a>

              <a @click="$router.push('/mission')" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  :active="link === '/mission'"
                  @click="link = '/mission'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="gps_fixed" />
                  </q-item-section>
                  
                  <q-item-section>
                    Mission
                  </q-item-section>
                </q-item>
              </a>

              <a @click="$router.push('/fonctionnalite')" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  :active="link === '/fonctionnalite'"
                  @click="link = '/fonctionnalite'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="task" />
                  </q-item-section>
                  
                  <q-item-section>
                    Fonctionnalité
                  </q-item-section>
                </q-item>
              </a>

              <a @click="$router.push('/tache')" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  :active="link === '/tache'"
                  @click="link = '/tache'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="task_alt" />
                  </q-item-section>
                  
                  <q-item-section>
                    Tâche 
                  </q-item-section>
                </q-item>
              </a>

              <a @click="$router.push('/sous-tache')" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  :active="link === '/sous-tache'"
                  @click="link = '/sous-tache'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="bookmark_added" />
                  </q-item-section>
                  
                  <q-item-section>
                    Sous-tâche
                  </q-item-section>
                </q-item>
              </a>

              <a @click="$router.push('/evaluation')" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  :active="link === '/evaluation'"
                  @click="link = '/evaluation'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="bar_chart" />
                  </q-item-section>
                  
                  <q-item-section>
                    Évaluation
                  </q-item-section>
                </q-item>
              </a>
              <a @click="$router.push('/team')" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  :active="link === '/team'"
                  @click="link = '/team'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="groups" />
                  </q-item-section>
                  
                  <q-item-section>
                    Équipe
                  </q-item-section>
                </q-item>
              </a>

              <a @click="$router.push('/profil')" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  :active="link === '/profil'"
                  @click="link = '/profil'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="person_outline" />
                  </q-item-section>
                  
                  <q-item-section>
                    Mon profil
                  </q-item-section>
                </q-item>
              </a>
              

              <!-- <a @click="$router.push('/')" style="text-decoration: none; color: white"> -->
              <a @click="logout" style="text-decoration: none; color: white">
                <q-item clickable v-ripple
                  @click="link = '/'"
                  :active="link === '/'"
                  active-class="my-menu-link">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  
                  <q-item-section>
                    Déconnexion
                  </q-item-section>
                </q-item>
              </a>


              
            </q-list>
        </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-white">
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
    <q-footer reveal class="bg-white no-shadow" >
      ok
    </q-footer>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Admin',
    icon: 'speed',
    link: '/dashboard'
  },
   {
    title: 'Liste des Missions',
    icon: 'auto_stories',
    link: '/recapulatif'
  },
  {
    title: 'Mission',
    icon: 'inventory',
    link: '/mission'
  },
  {
    title: 'Fonctionnalité',
    icon: 'task',
    link: '/fonctionnalite'
  },
  {
    title: 'Tache',
    icon: 'task_alt',
    link: '/tache'
  },
  {
    title: 'Sous Tache',
    icon: 'bookmark_added',
    link: '/sous-tache'
  },
  {
    title: 'Evaluation',
    icon: 'bar_chart',
    link: '/evaluation'
  },
  {
    title: 'Team',
    icon: 'group',
    link: '/team'
  },
  {
    title: 'Deconnexion',
    icon: 'logout',
    link: '/'
  }
];
import axios from 'axios'
import qs from "qs";
import { useQuasar } from 'quasar'
import {useRouter} from "vue-router"
import { defineComponent, ref, onMounted, getCurrentInstance, onBeforeMount } from 'vue'
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const $q = useQuasar()
    const instance = getCurrentInstance();
    const router = useRouter();
    const leftDrawerOpen = ref(false)
    let notifications = ref([])
    let compteur = ref()
    //let loading = ref(false) 
    let loading = false 
    let start = 0;
    let limit = 10;
    
    let date = new Date()
    //console.log('Heure : ', date);

    const user = $q.sessionStorage.getItem('user')
    const token = $q.sessionStorage.getItem('token')

    onBeforeMount(() => {
      if (token === null) {
        router.push('/')
      }
    })

    onMounted(async () => {

      if (token) {
        await getItems()
      setInterval(async () => {
          await getItems()
        }, 10000)
      }
      
      // console.log(router.currentRoute.value.path);

    })

    let getItems = async (replace) => {
      const params = qs.stringify({
        _where: [{ user:  user.id}],
        _start: start,
        _limit: limit,
        _sort: "createdAt:DESC"
      });

      const query = qs.stringify({
        _where: [{ user:  user.id}, { lu: false}],
      });

      

      try {
        //Compter les notifications
        let count = await await instance.appContext.app.config.globalProperties.$api({
          url: `/notifications/count?${query}`,
          method: "get",
          headers: {
              Authorization: `Bearer ${token}`,
            },
        })
        compteur.value = count.data

        //Recuperer les notifications
        let res = await await instance.appContext.app.config.globalProperties.$api({
        url: `/notifications?${params}`,
        method: "get",
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })
      // notifications.value = res.data

      if (replace) {

        notifications.value = res.data

      } else {
          for (const fetched_item of res.data) {
              if (notifications.value.length > 0) {

                  let in_table = false
                  for (const task_item of notifications.value) {
                      if (task_item._id === fetched_item._id) {
                          in_table = true
                      }
                  }

                  if (!in_table) {
                      notifications.value.push(fetched_item)
                  }

              } else {
                  notifications.value.push(fetched_item)
              }
          }

          //console.log("notifications : ", notifications.value);
      }
        return res.data

      } catch (error) {
        console.log(error);
      }

    }

    let onLire = async (item)  => {
 
      let res = await await instance.appContext.app.config.globalProperties.$api({
        url: `/notifications/${item.id}`, 
        method: "put",
        data: {
          lu: true,
        },
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })
      await getItems()
    }

  let logout = async () => {
    await sessionStorage.clear()
    await router.push('/')
  }


   // scroll infinite
  let onLoad = async (index, done) => {
      try {
        if (loading) {
          done();
        } else {
          if (index) {
            loading = true;
            let notify = await getItems()
            loading = false

            if (notify.length === 0) {
              done(true);
            } else {
              start += notify.length
              done()
            }
          } else {
            loading = true;
            let notify = await getItems();
            loading = false;
            start += notify.length;
            done ? done() : "";
          }
        }
      } catch (error) {
        console.log(error);
      }
    }


    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      notifications,
      onLire,
      compteur,
      date,
      link: ref(router.currentRoute.value.path),
      logout,
      onLoad,
      //loading,




       thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }

    }
    
  }
})
</script>

<style lang="sass" scoped>
 
.my-menu-link
  color: #1976D2
  background: #fff
  border-radius: 5px 0px 0px 5px
  left: 20px
  font-weight: bolder
.bg-bleuligth
  background: #ebedf3 !important
.menu-style
  border-radius:  30px 0px 0px 30px
q-drawer
  background: #ebedf3 !important
q-footer 
  shadow : none !important

</style>