<template>
    <div>
        <h2 class="text-4xl font-semibold mb-10">Brand Form</h2>

        <!-- ✅ Wrap ด้วย form -->
        <form @submit.prevent="save">
            <!-- Brand Name Field -->
            <div class="mb-4">
                <label for="brandName" class="block font-medium mb-2">Brand Name <span class="text-red-500"> * </span></label>
                <input type="text" id="brandName" maxlength="50" v-model="brandName" placeholder="Enter brand name"
                    class="w-xl border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
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
import { createBrand, updateBrand } from '../../composable/Brands/Brands'
import Swal from 'sweetalert2'
import * as yup from 'yup'

const router = useRouter()
const route = useRoute();
const brandName = ref('')

onMounted(() => {
    const brand = route.state?.brand;
    console.log(brand);  // ตรวจสอบข้อมูลที่ได้รับจาก state

    if (brand) {
        brandName.value = brand.brand_name;
    } else {
        console.error('No brand data found in state!');
    }
});

const schema = yup.object({
    brand_name: yup.string().trim().required('Brand name is required').max(50)
})

const save = async () => {
    try {
        // ✅ Validate input ก่อนส่ง
        await schema.validate({ brand_name: brandName.value }, { abortEarly: false })

        const payload = {
            brand_name: brandName.value.trim(),
            status: 'active'
        }

        const result = await createBrand(payload)

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Brand created successfully!',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                router.push('/brands')
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: result.message === 'Brand name already exists'
                    ? 'Brand name already exists'
                    : 'Failed to create brand',
                text: result.message !== 'Brand name already exists'
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
    background-color:  var(--color-button-cancel-hover);
}
</style>
