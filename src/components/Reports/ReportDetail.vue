<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getExchangeReportDetail, markExchangeReportResolved } from '../../composable/Reports/GetReports'

const route = useRoute()
const router = useRouter()
const reportId = route.params.id

const report = ref(null)
const error = ref(null)
const isUpdating = ref(false)

const fetchReport = async () => {
    const res = await getExchangeReportDetail(reportId)
    if (res.success) {
        report.value = res.data
    } else {
        error.value = res.message
    }
}

onMounted(fetchReport)

const markAsResolved = async () => {
    if (!report.value || report.value.report_status === 'resolved') return
    isUpdating.value = true
    const res = await markExchangeReportResolved(reportId)
    if (res.success) {
        await fetchReport()
    } else {
        error.value = res.message
    }
    isUpdating.value = false
}
</script>

<template>
    <div class="min-h-screen dark:bg-gray-900 flex items-start justify-center px-4 py-10">
        <div class="w-full max-w-4xl">
            <div v-if="error" class="text-red-600 text-center font-semibold mb-4">
                {{ error }}
            </div>

            <div v-if="report"
                class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row justify-between gap-6">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Reporter</p>
                        <p class="text-lg font-semibold text-gray-900 dark:text-white">
                            {{ report.reporter_username }}
                        </p>
                    </div>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Report Type</p>
                        <p class="text-lg font-semibold capitalize text-gray-900 dark:text-white">
                            {{ report.report_type }}
                        </p>
                    </div>
                </div>

                <!-- Status & Created -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p class="text-gray-500 mb-2 dark:text-gray-400 text-sm">Status</p>
                        <p class="inline-block px-3 py-1 text-sm rounded-full font-semibold" :class="{
                            'bg-yellow-100 text-yellow-800': report.report_status === 'pending',
                            'bg-green-100 text-green-800': report.report_status === 'resolved'
                        }">
                            {{ report.report_status }}
                        </p>
                    </div>

                    <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Created At</p>
                        <p class="text-gray-900 dark:text-white">
                            {{ new Date(report.created_at).toLocaleString() }}
                        </p>
                    </div>
                </div>

                <!-- Reason -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Email</p>
                    <p class="text-gray-900 dark:text-white whitespace-pre-wrap break-words leading-relaxed">
                        {{ report.reporter_email }}
                    </p>
                    </div>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Exchange ID</p>
                        <p class="text-gray-900 dark:text-white">
                            {{ report.exchange_id }}
                        </p>
                    </div>
                </div>

                <!-- Reason -->
                <div>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Reason</p>
                    <p class="text-gray-900 dark:text-white whitespace-pre-wrap break-words leading-relaxed">
                        {{ report.reason }}
                    </p>
                </div>

                <!-- Resolve info -->
                <div v-if="report.resolved_by || report.resolved_at" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div v-if="report.resolved_by">
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Resolved By</p>
                        <p class="text-gray-900 dark:text-white">{{ report.resolved_by }}</p>
                    </div>

                    <div v-if="report.resolved_at">
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Resolved At</p>
                        <p class="text-gray-900 dark:text-white">
                            {{ new Date(report.resolved_at).toLocaleString() }}
                        </p>
                    </div>
                </div>

                <!-- Buttons -->
                <div class="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                    <!-- Back Button -->
                    <button @click="router.back()"
                        class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition">
                        ← Back
                    </button>

                    <!-- Mark as Resolved Button -->
                    <button v-if="report.report_status !== 'resolved'" @click="markAsResolved" :disabled="isUpdating"
                        class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition">
                        {{ isUpdating ? 'Updating...' : 'Mark as Resolved' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
