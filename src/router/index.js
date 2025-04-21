import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../Layouts/MainLayouts.vue'
import BrandLists from '../components/Brands/BrandLists.vue'
import Collections from '../components/Collections/CollectionLists.vue'
import SubCollections from '../components/SubCollections/SubCollectionLists.vue'
import ReportLists from '../components/Reports/ReportLists.vue'
import ReportDetail from '../components/Reports/ReportDetail.vue'
import Login from '../components/Auth/Login.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'brands',
        component: BrandLists
      },
      {
        path: 'collections',
        component: Collections
      },
      {
        path: 'subcollections',
        component: SubCollections
      },
      {
        path: 'reports',
        component: ReportLists
      },
      {
        path: '/exchange-reports/:id',
        name: 'ReportDetail',
        component: ReportDetail
      },
      {
        path: '',
        redirect: '/login' // default page
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
