<template>
    <div>
        <!-- ✅ Wrap ด้วย form -->
        <form @submit.prevent="submit">
            <!-- Subcollection Name Field -->
            <!-- Subcollection Name Field -->
            <div class="mb-4">
                <label for="subCollectionName" class="block font-medium mb-2">
                    Subcollection Name <span class="text-red-500">*</span>
                </label>
                <input type="text" id="subCollectionName" maxlength="50" v-model="subCollectionName"
                    placeholder="Enter subCollection name"
                    class="w-xl border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            <!-- collection Select Field -->
            <div class="mb-4">
                <label for="collection" class="block font-medium mb-2">
                    Select Collection <span class="text-red-500">*</span>
                </label>
                <select id="collection" v-model="selectedCollectionId"
                    class="w-xl border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option disabled value="" class="text-gray-400">-- Please select a collection --</option>
                    <option v-for="collection in collectionList" :key="collection.id" :value="collection.id">
                        {{ collection.collection_name }}
                    </option>
                </select>
            </div>

            <!-- Status Select Field -->
            <div class="mb-4">
                <label for="status" class="block font-medium mb-2">
                    Status <span class="text-red-500">*</span>
                </label>
                <select id="status" v-model="status"
                    class="w-xl border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option disabled value="" class="text-gray-400">-- Please select status --</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <!-- Save / Cancel Buttons -->
            <div class="flex justify-end gap-4 mt-10">
                <button @click="cancel" class="cancel-button px-4 py-2 shadow-md font-bold rounded-md transition"
                    type="button">
                    Cancel
                </button>
                <button type="submit" :disabled="id && !isDirty"
                    class="save-button px-4 py-2 font-bold shadow-md text-gray-800 rounded-md transition">
                    Save
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createSubCollection, getSubCollectionById, updateSubCollection } from '../../composable/SubCollections/SubCollection'
import { getAllCollections } from "../../composable/Collections/Collections";
import Swal from 'sweetalert2'
import * as yup from 'yup'

const router = useRouter()
const route = useRoute();
const subCollectionName = ref('')
const collectionList = ref([])
const selectedCollectionId = ref('')
const originalCollectionId = ref('')
const originalSubCollectionName = ref('')
const id = ref(null);
const status = ref('active'); // default active
const originalStatus = ref('active');

onMounted(async () => {
    await fetchCollections();
    if (route.params.id) {
        id.value = route.params.id
        await getById()
    }
});

const schema = yup.object({
    sub_collection_name: yup.string().trim().required('Subcollection name is required').max(50),
    collection_id: yup.string().required('Please select a collection'),
    status: yup.string().oneOf(['active', 'inactive'], 'Invalid status').required('Please select status')
})

const isDirty = computed(() => {
    return (
        subCollectionName.value.trim() !== originalSubCollectionName.value.trim() ||
        selectedCollectionId.value !== originalCollectionId.value ||
        status.value !== originalStatus.value
    );
});

const create = async (payload) => {
    const result = await createSubCollection(payload)
    return result
}

const update = async (id, payload) => {
    const result = await updateSubCollection(id, payload)
    return result
}

const submit = async () => {
    try {
        // ✅ Validate input ก่อนส่ง
        await schema.validate({
            sub_collection_name: subCollectionName.value,
            collection_id: selectedCollectionId.value,
            status: status.value
        }, { abortEarly: false })

        const payload = {
            sub_collection_name: subCollectionName.value.trim(),
            collection_id: selectedCollectionId.value,
            status: status.value
        }

        const result = id.value
            ? await update(id.value, payload)
            : await create(payload)

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: id.value ? 'Subcollection updated successfully!' : 'Subcollection created successfully!',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                router.push('/subcollections')
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: result.message === 'Subcollection name already exists'
                    ? 'Subcollection name already exists'
                    : id.value ? 'Failed to update subcollection' : 'Failed to create subcollection',
                text: result.message !== 'Subcollection name already exists' ? result.message : '',
                confirmButtonColor: '#d33'
            })
        }

    } catch (err) {
        if (err instanceof yup.ValidationError) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: err.errors.join(', '),
                confirmButtonColor: '#f59e0b'
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Something went wrong while submitting the form.',
                confirmButtonColor: '#d33'
            })
        }
    }
}

const fetchCollections = async () => {
    const response = await getAllCollections();
    if (response.success) {
        collectionList.value = response.data;
    } else {
        console.error("⚠️ Error loading collections:", response.message);
    }
}

const getById = async () => {
    try {
        const res = await getSubCollectionById(id.value)
        if (res.success) {
            subCollectionName.value = res.data.sub_collection_name
            selectedCollectionId.value = res.data.collection_id
            status.value = res.data.status || 'active' // กรณีไม่มี status เผื่อไว้
            originalSubCollectionName.value = res.data.sub_collection_name
            originalCollectionId.value = res.data.collection_id
            originalStatus.value = res.data.status || 'active'
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed to fetch subcollection',
                text: res.message || 'Unknown error',
                confirmButtonColor: '#d33'
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to load subcollection data',
            confirmButtonColor: '#d33'
        })
    }
}

const cancel = () => {
    router.push('/subcollections')
}
</script>

<style scope>
button {
    cursor: pointer;
    /* เพิ่ม cursor: pointer ให้ปุ่มทั้งหมด */
}

.save-button {
    background-color: var(--color-primary);
}

.save-button:hover {
    background-color: var(--color-button-hover);
}

button.cancel-button {
    background-color: white;
}

button.cancel-button:hover {
    background-color: var(--color-button-cancel-hover);
}

@media (max-width: 640px) {

    /* Input ปรับเต็มจอ */
    input[type="text"] {
        width: 100% !important;
        font-size: 14px;
        padding: 10px;
    }

    select {
        width: 100%;
        font-size: 14px;
        padding: 10px;
    }

    /* Label ขนาดเล็กลงนิดนึง */
    label {
        font-size: 14px;
    }
}
</style>
