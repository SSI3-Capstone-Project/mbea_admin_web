import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../Layouts/MainLayouts.vue'
import BrandLists from '../components/Brands/BrandLists.vue'
import CollectionLists from '../components/Collections/CollectionLists.vue'
import SubCollectionLists from '../components/SubCollections/SubCollectionLists.vue'
import ReportLists from '../components/Reports/ReportLists.vue'
import ReportDetail from '../components/Reports/ReportDetail.vue'
import Login from '../components/Auth/Login.vue'
import BrandForm from '../components/Brands/ฺBrandForm.vue'
import CollectionForm from '../components/Collections/CollectionForm.vue'
import SubCollectionForm from '../components/SubCollections/SubCollectionForm.vue'

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
        path: 'brands/form',
        component: BrandForm
      },
      {
        path: 'brands/form/:id',
        component: BrandForm
      },
      {
        path: 'collections',
        component: CollectionLists
      },
      {
        path: 'collections/form',
        component: CollectionForm
      },
      {
        path: 'collections/form/:id',
        component: CollectionForm
      },
      {
        path: 'subcollections',
        component: SubCollectionLists
      },
      {
        path: 'subcollections/form',
        component: SubCollectionForm
      },
      {
        path: 'subcollections/form/:id',
        component: SubCollectionForm
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
