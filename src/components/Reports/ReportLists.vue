<script setup>
import { ref, onMounted } from 'vue'
import { getExchangeReports } from '../../composable/Reports/GetReports'

const reports = ref([])
const error = ref(null)

onMounted(async () => {
  const res = await getExchangeReports()
  if (res.success) {
    reports.value = res.data
  } else {
    error.value = res.message
  }
})
</script>

<template>
  <div class="p-6">
    <!-- <h1 class="text-2xl font-bold mb-4">Exchange Reports</h1> -->
    <p v-if="error" class="text-red-500">{{ error }}</p>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="px-6 py-3">Reporter</th>
            <th class="px-6 py-3">Type</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3">Created At</th>
            <th class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="report in reports"
            :key="report.id"
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
          >
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
              {{ report.reporter_username }}
            </td>
            <td class="px-6 py-4 ">{{ report.report_type }}</td>
            <td class="px-6 py-4 capitalize">
              <span
                :class="{
                  'text-yellow-600 font-semibold': report.report_status === 'pending',
                  'text-green-600 font-semibold': report.report_status === 'resolved'
                }"
              >
                {{ report.report_status }}
              </span>
            </td>
            <td class="px-6 py-4">
              {{ new Date(report.created_at).toLocaleString() }}
            </td>
            <td class="px-6 py-4">
                <router-link
  :to="`/exchange-reports/${report.id}`"
  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
>
  View
</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
