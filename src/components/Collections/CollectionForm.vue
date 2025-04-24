<template>
    <div>
        <!-- ✅ Wrap ด้วย form -->
        <form @submit.prevent="submit">
            <!-- Collection Name Field -->
            <div class="mb-4">
                <label for="collectionName" class="block font-medium mb-2">
                    Collection Name <span class="text-red-500">*</span>
                </label>
                <input type="text" id="collectionName" maxlength="50" v-model="collectionName"
                    placeholder="Enter collection name"
                    class="w-xl border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            <!-- Brand Select Field -->
            <div class="mb-4">
                <label for="brand" class="block font-medium mb-2">
                    Select Brand <span class="text-red-500">*</span>
                </label>
                <select id="brand" v-model="selectedBrandId"
                    class="w-xl border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option disabled value="" class="text-gray-400">-- Please select a brand --</option>
                    <option v-for="brand in brandList" :key="brand.id" :value="brand.id">
                        {{ brand.brand_name }}
                    </option>
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
import { createCollection, getCollectionById, updateCollection } from '../../composable/Collections/Collections'
import { getAllBrands } from "../../composable/Brands/Brands";
import Swal from 'sweetalert2'
import * as yup from 'yup'

const router = useRouter()
const route = useRoute();
const collectionName = ref('')
const brandList = ref([])
const selectedBrandId = ref('')
const originalCollectionName = ref('')
const originalBrandId = ref('')
const id = ref(null);

onMounted(async () => {
    await fetchBrands();
    if (route.params.id) {
        id.value = route.params.id
        await getById()
    }
});

const isDirty = computed(() => {
    return collectionName.value.trim() !== originalCollectionName.value.trim() || selectedBrandId.value !== originalBrandId.value
})

const schema = yup.object({
    collection_name: yup.string().trim().required('Collection name is required').max(50),
    brand_id: yup.string().required('Please select a brand')
})

const create = async (payload) => {
    const result = await createCollection(payload)
    return result
}

const update = async (id, payload) => {
    const result = await updateCollection(id, payload)
    return result
}

const submit = async () => {
    try {
        // ✅ Validate input ก่อนส่ง
        await schema.validate({ collection_name: collectionName.value, brand_id: selectedBrandId.value }, { abortEarly: false })

        const payload = {
            collection_name: collectionName.value.trim(),
            brand_id: selectedBrandId.value,
            status: 'active'
        }

        const result = id.value
            ? await update(id.value, payload)
            : await create(payload)

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: id.value ? 'Collection updated successfully!' : 'Collection created successfully!',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                router.push('/collections')
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: result.message === 'Collection name already exists'
                    ? 'Collection name already exists'
                    : id.value ? 'Failed to update collection' : 'Failed to create collection',
                text: result.message !== 'Collection name already exists' ? result.message : '',
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

const fetchBrands = async () => {
    const response = await getAllBrands();
    if (response.success) {
        brandList.value = response.data;
    } else {
        console.error("⚠️ Error loading brands:", response.message);
    }
}

const getById = async () => {
    try {
        const res = await getCollectionById(id.value)
        if (res.success) {
            collectionName.value = res.data.collection_name
            selectedBrandId.value = res.data.brand_id
            originalCollectionName.value = res.data.collection_name
            originalBrandId.value = res.data.brand_id
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed to fetch collection',
                text: res.message || 'Unknown error',
                confirmButtonColor: '#d33'
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to load collection data',
            confirmButtonColor: '#d33'
        })
    }
}

const cancel = () => {
    router.push('/collections')
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
