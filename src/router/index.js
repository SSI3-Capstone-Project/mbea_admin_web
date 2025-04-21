import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../Layouts/MainLayouts.vue'
import BrandLists from '../components/Brands/BrandLists.vue'
import Collections from '../components/Collections/CollectionLists.vue'
import SubCollections from '../components/SubCollections/SubCollectionLists.vue'
import ReportLists from '../components/Reports/ReportLists.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
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
        path: '',
        redirect: '/reports' // default page
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
