<template>
    <div>
        <h2 class="text-4xl font-semibold mb-10">Collection Form</h2>

        <!-- ✅ Wrap ด้วย form -->
        <form @submit.prevent="save" @keydown.enter="save">
            <!-- Collection Name Field -->
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
                <button type="submit"
                    class="save-button px-4 py-2 font-bold shadow-md text-gray-800 rounded-md transition">
                    Save
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createCollection, updateCollection } from '../../composable/Collections/Collections'
import { getAllBrands } from "../../composable/Brands/Brands";
import Swal from 'sweetalert2'
import * as yup from 'yup'

const router = useRouter()
const route = useRoute();
const collectionName = ref('')
const brandList = ref([])
const selectedBrandId = ref('')

onMounted(async () => {
    await fetchBrands();
    const collection = route.state?.collection;
    console.log(collection);  // ตรวจสอบข้อมูลที่ได้รับจาก state

    if (collection) {
        collectionName.value = collection.collection_name;
    } else {
        console.error('No collection data found in state!');
    }
});

const schema = yup.object({
    collection_name: yup.string().trim().required('Collection name is required').max(50),
    brand_id: yup.string().required('Please select a brand')
})

const save = async () => {
    try {
        // ✅ Validate input ก่อนส่ง
        await schema.validate({ collection_name: collectionName.value, brand_id: selectedBrandId.value }, { abortEarly: false })

        const payload = {
            collection_name: collectionName.value.trim(),
            brand_id: selectedBrandId.value,
            status: 'active'
        }

        const result = await createCollection(payload)

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Collection created successfully!',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                router.push('/collections')
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: result.message === 'Collection name already exists'
                    ? 'Collection name already exists'
                    : 'Failed to create collection',
                text: result.message !== 'collection name already exists'
                    ? result.message
                    : '',
                confirmButtonColor: '#d33'
            })
        }
    } catch (err) {
        // ❌ แสดง validation error
        if (err instanceof yup.ValidationError) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: err.errors.join(', '), // รวม error หลายอันถ้ามี
                confirmButtonColor: '#f59e0b'
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
</style>
