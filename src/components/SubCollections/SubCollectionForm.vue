<template>
    <div>
        <h2 class="text-4xl font-semibold mb-10">Subcollection Form</h2>

        <!-- ✅ Wrap ด้วย form -->
        <form @submit.prevent="save" @keydown.enter="save">
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
import { createSubCollection, updateSubCollection } from '../../composable/SubCollections/SubCollection'
import { getAllCollections } from "../../composable/Collections/Collections";
import Swal from 'sweetalert2'
import * as yup from 'yup'

const router = useRouter()
const route = useRoute();
const subCollectionName = ref('')
const collectionList = ref([])
const selectedCollectionId = ref('')

onMounted(async () => {
    await fetchCollections();
    const subCollection = route.state?.subCollection;
    console.log(subCollection);  // ตรวจสอบข้อมูลที่ได้รับจาก state

    if (subCollection) {
        subCollectionName.value = subCollection.subCollection_name;
    } else {
        console.error('No subCollection data found in state!');
    }
});

const schema = yup.object({
    subCollection_name: yup.string().trim().required('Subcollection name is required').max(50),
    collection_id: yup.string().required('Please select a collection')
})

const save = async () => {
    try {
        // ✅ Validate input ก่อนส่ง
        await schema.validate({ subCollection_name: subCollectionName.value, collection_id: selectedCollectionId.value }, { abortEarly: false })

        const payload = {
            sub_collection_name: subCollectionName.value.trim(),
            collection_id: selectedCollectionId.value,
            status: 'active'
        }

        const result = await createSubCollection(payload)

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Subcollection created successfully!',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                router.push('/subcollections')
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: result.message === 'Subcollection name already exists'
                    ? 'Subcollection name already exists'
                    : 'Failed to create Subcollection',
                text: result.message !== 'Subcollection name already exists'
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

const fetchCollections = async () => {
    const response = await getAllCollections();
    if (response.success) {
        collectionList.value = response.data;
    } else {
        console.error("⚠️ Error loading collections:", response.message);
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
</style>
