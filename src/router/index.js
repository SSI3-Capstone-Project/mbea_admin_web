import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../Layouts/MainLayouts.vue'
import BrandLists from '../components/Brands/BrandLists.vue'
import CollectionLists from '../components/Collections/CollectionLists.vue'
import ReportLists from '../components/Reports/ReportLists.vue'
import ReportDetail from '../components/Reports/ReportDetail.vue'
import Login from '../components/Auth/Login.vue'
import BrandForm from '../components/Brands/ฺBrandForm.vue'
import CollectionForm from '../components/Collections/CollectionForm.vue'
import SubcollectionLists from '../components/SubCollections/SubCollectionLists.vue'
import SubcollectionForm from '../components/SubCollections/SubCollectionForm.vue'

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
        component: BrandLists,
        meta: { title: 'Brands' }
      },
      {
        path: 'brands/form',
        component: BrandForm,
        meta: { title: 'Add Brand' }
      },
      {
        path: 'brands/form/:id',
        component: BrandForm,
        meta: { title: 'Edit Brand' }
      },      
      {
        path: 'collections',
        component: CollectionLists,
        meta: { title: 'Collections' }
      },
      {
        path: 'collections/form',
        component: CollectionForm,
        meta: { title: 'Add Collections' }
      },
      {
        path: 'collections/form/:id',
        component: CollectionForm,
        meta: { title: 'Edit Collections' }
      },
      {
        path: 'subcollections',
        component: SubcollectionLists,
        meta: { title: 'Subcollections' }
      },
      {
        path: 'subcollections/form',
        component: SubcollectionForm,
        meta: { title: 'Add Subcollections' }
      },
      {
        path: 'subcollections/form/:id',
        component: SubcollectionForm,
        meta: { title: 'Edit Subcollections' }
      },
      {
        path: 'reports',
        component: ReportLists,
        meta: { title: 'Reports' }
      },
      {
        path: 'exchange-reports/:id',
        name: 'ReportDetail',
        component: ReportDetail,
        meta: { title: 'Report Detail' }
      },
      {
        path: '',
        redirect: { path: 'login' } // default page
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
