<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getExchangeReports } from '../../composable/Reports/GetReports'

const reports = ref([])
const error = ref(null)
const selectedStatus = ref('all')
const showDropdown = ref(false)
const dropdownRef = ref(null) // 🔵 เพิ่ม ref สำหรับ dropdown
const buttonRef = ref(null)    // 🔵 เพิ่ม ref สำหรับปุ่ม

onMounted(async () => {
  const res = await getExchangeReports()
  if (res.success) {
    reports.value = res.data
  } else {
    error.value = res.message
  }

  // ➡️ Setup listener เวลากดที่ไหนก็ได้
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  // ถ้าไม่ได้คลิกที่ dropdown หรือปุ่ม => ปิด dropdown
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target) &&
    buttonRef.value &&
    !buttonRef.value.contains(event.target)
  ) {
    showDropdown.value = false
  }
}

const filteredReports = computed(() => {
  if (selectedStatus.value === 'all') return reports.value
  return reports.value.filter(r => r.report_status === selectedStatus.value)
})
</script>

<template>
  <div class="p-6">
    <p v-if="error" class="text-red-500">{{ error }}</p>

    <div class="relative inline-block text-left mb-5">
      <button 
        ref="buttonRef" 
        @click="showDropdown = !showDropdown"
        class="text-gray-700 bg-gray-50 shadow-md hover:bg-gray-100 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
        type="button"
      >
        Filter Status
        <svg class="w-2.5 h-2.5 ms-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m1 1 4 4 4-4" />
        </svg>
      </button>

      <div 
        v-if="showDropdown" 
        ref="dropdownRef" 
        class="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow"
      >
        <ul class="p-3 space-y-1 text-sm text-gray-700">
          <li v-for="(label, value) in { all: 'ALL', pending: 'Pending', resolved: 'Resolved' }" :key="value">
            <div class="flex items-center p-2 rounded hover:bg-gray-100">
              <input
                type="radio"
                :id="`radio-${value}`"
                :value="value"
                v-model="selectedStatus"
                name="status-filter"
                class="w-4 h-4 text-gray-600 accent-gray-500 bg-gray-100 border-gray-300 focus:ring-gray-500"
              />
              <label :for="`radio-${value}`" class="ml-2 text-sm font-medium text-gray-900">
                {{ label }}
              </label>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- ตารางแสดงผล -->
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
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
            v-for="report in filteredReports"
            :key="report.id"
            class="odd:bg-white even:bg-gray-50 border-b border-gray-200"
          >
            <td class="px-6 py-4 font-medium text-gray-900">
              {{ report.reporter_username }}
            </td>
            <td class="px-6 py-4">{{ report.report_type }}</td>
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
                class="font-medium text-blue-600 hover:underline"
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
