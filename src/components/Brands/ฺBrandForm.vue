<template>
    <div>
        <!-- ✅ Wrap ด้วย form -->
        <form @submit.prevent="submit">
            <!-- Brand Name Field -->
            <div class="mb-4">
                <label for="brandName" class="block font-medium mb-2">Brand Name <span class="text-red-500"> *
                    </span></label>
                <input type="text" id="brandName" maxlength="50" v-model="brandName" placeholder="Enter brand name"
                    class="w-xl border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            <!-- Status Select Field -->
            <div class="mb-4">
                <label for="status" class="block font-medium mb-2">
                    Status <span class="text-red-500">*</span>
                </label>
                <select id="status" v-model="status"
                    class="w-xl border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option disabled value="" class="text-gray-400">-- Please select status --</option>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                </select>
            </div>

            <!-- Save / Cancel Buttons -->
            <div class="flex justify-end gap-4 mt-10">
                <button @click="cancel" class="cancel-button px-4 py-2 shadow-md font-bold rounded-md transition"
                    type="button">
                    Cancel
                </button>
                <!-- Save Button -->
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
import { createBrand, updateBrand, getBrandById } from '../../composable/Brands/Brands'
import Swal from 'sweetalert2'
import * as yup from 'yup'

const router = useRouter()
const route = useRoute();
const brandName = ref('')
const originalBrandName = ref('')
const id = ref(null);
const status = ref('active'); // default active
const originalStatus = ref('active');

onMounted(async () => {
    if (route.params.id) {
        id.value = route.params.id
        await getById()
    }
});

const isDirty = computed(() => {
    return brandName.value.trim() !== originalBrandName.value.trim() || status.value !== originalStatus.value

})

const schema = yup.object({
    brand_name: yup.string().trim().required('Brand name is required').max(50),
    status: yup.string().oneOf(['active', 'inactive'], 'Invalid status').required('Please select status')
})

const create = async (payload) => {
    const result = await createBrand(payload)
    return result
}

const update = async (id, payload) => {
    const result = await updateBrand(id, payload)
    return result
}

const submit = async () => {
    try {
        // ✅ Validate input ก่อนส่ง
        await schema.validate({ brand_name: brandName.value, status: status.value }, { abortEarly: false })

        const payload = {
            brand_name: brandName.value.trim(),
            status: status.value
        }

        const result = id.value
            ? await update(id.value, payload)
            : await create(payload)

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: id.value ? 'Brand updated successfully!' : 'Brand created successfully!',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                router.push('/brands')
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: result.message === 'Brand name already exists'
                    ? 'Brand name already exists'
                    : id.value ? 'Failed to update brand' : 'Failed to create brand',
                text: result.message !== 'Brand name already exists' ? result.message : '',
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

const getById = async () => {
    try {
        const res = await getBrandById(id.value)
        if (res.success) {
            brandName.value = res.data.brand_name
            originalBrandName.value = res.data.brand_name
            status.value = res.data.status || 'active'
            originalStatus.value = res.data.status || 'active'
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed to fetch brand',
                text: res.message || 'Unknown error',
                confirmButtonColor: '#d33'
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to load brand data',
            confirmButtonColor: '#d33'
        })
    }
}

const cancel = () => {
    router.push('/brands')
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

.save-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 640px) {

    /* Input ปรับเต็มจอ */
    input[type="text"] {
        width: 100% !important;
        font-size: 14px;
        padding: 10px;
    }

    /* Label ขนาดเล็กลงนิดนึง */
    label {
        font-size: 14px;
    }
}
</style>
