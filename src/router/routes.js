
const routes = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { path: '', name:'Login', component: () => import('pages/Login.vue') },
      { path: '/Inscription', name: 'Inscription' ,component: () => import('pages/Inscription.vue') },
      { path: '/attente', name: 'Attente' ,component: () => import('pages/Attente.vue') },
      // { path: '/apexchart', name: 'Attente' ,component: () => import('pages/Apexchart.vue') },
      
    ]
  },
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Profile.vue') },
      { path: '/reset-password', component: () => import('pages/ResetPassword.vue') },
      { path: '/sous-tache', component: () => import('pages/SousTache.vue') },
      { path: '/team', component: () => import('pages/Team.vue') },
      { path: '/evaluation', component: () => import('pages/Evaluation.vue') },
      { path: '/dashboard', component: () => import('pages/DashBoard.vue') },
      { path: '/mission', component: () => import('src/pages/Missionliste.vue') },
      { path: '/tache', component: () => import('pages/Tache.vue') },
      { path: '/fonctionnalite', component: () => import('pages/Fonctionnalite.vue') },
      { path: '/recapulatif',name: 'recapulatif',component: () => import('src/pages/Recapulatif.vue') },
      { path: '/detail', component: () => import('pages/ShowDetail.vue') },
      { path: '/detail_mission',name:'detail_mission',props: true , component: () => import('src/pages/DetailMission.vue') },
      { path: '/profil', component: () => import('pages/Profil.vue') },
      { path: '/chart', component: () => import('pages/test.vue') },
    ]
  },
  
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
