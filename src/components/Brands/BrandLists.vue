<template>
    <div class="">
        <div class="flex justify-between items-center mb-6 w-full">
            <!-- Filter Input -->
            <input type="text" v-model="filterBrandName" @input="fetchBrands" placeholder="Search brand name"
                class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button class="add-button items-center shadow-md" @click="addBrand">
                Add Brand
            </button>
        </div>
        <table class="brand-table ">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Brand Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(brand, index) in brands" :key="brand.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ brand.brand_name }}</td>
                    <td>
                        <button class="shadow-md" @click="editBrand(brand)">edit</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getAllBrands } from "../../composable/Brands/Brands";
import debounce from "lodash.debounce";

export default {
    setup() {
        const brands = ref([]);
        const router = useRouter();
        const filterBrandName = ref("");

        const fetchBrands = async () => {
            const params = {};
            if (filterBrandName.value.trim()) {
                params.brand_name = filterBrandName.value.trim();
            }

            const response = await getAllBrands(params);
            if (response.success) {
                brands.value = response.data;
            } else {
                console.error("⚠️ Error loading brands:", response.message);
            }
        };

        const editBrand = (brand) => {
            console.log("Editing brand:", brand.id);
            router.push({
                path: `/brands/form/${brand.id}`,
            });
        };

        const addBrand = () => {
            router.push("/brands/form");
        };

        const debouncedFetch = debounce(fetchBrands, 400);
        watch(filterBrandName, debouncedFetch);

        onMounted(fetchBrands);

        return { brands, editBrand, addBrand, filterBrandName, fetchBrands };
    }
};
</script>

<style scoped>
/* Style for the table container */
.table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 20px;
}

h1 {
    text-align: center;
}

/* Style for the table */
.brand-table {
    width: 100%;
    /* ยังคงใช้ขนาดเต็ม */
    border-collapse: collapse;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-top: 20px;
}

th,
td {
    padding: 12px 16px;
    text-align: center;
    /* จัดข้อมูลให้อยู่กลางแนวนอน */
    vertical-align: middle;
    /* จัดข้อมูลให้ตรงกลางแนวตั้ง */
}

th {
    background-color: var(--color-primary);
    font-weight: bold;
}

/* Actions buttons */
button {
    background-color: var(--color-primary);
    padding: 6px 12px;
    margin: 0 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

button:hover {
    background-color: var(--color-button-hover);
}

button {
    background-color: var(--color-primary);
    padding: 6px 12px;
    margin: 0 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

/* บรรทัด input กับปุ่ม */
.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap; /* 💡 ห้ามขึ้นบรรทัดใหม่ */
    gap: 12px;
}

/* กำหนด input กว้างพอดี */
input[type="text"] {
    flex: 1;
    max-width: 300px;
    min-width: 150px;
}

/* ปุ่ม Add Brand */
.add-button {
    background-color: var(--color-primary);
    padding: 8px 16px;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;
}

/* Responsive สำหรับจอเล็ก */
@media (max-width: 640px) {
    input[type="text"] {
        font-size: 14px;
        padding: 6px 10px;
        max-width: 200px;
    }

    .add-button {
        font-size: 14px;
        padding: 6px 12px;
    }

    th,
    td {
        font-size: 14px;
        padding: 8px 12px;
    }
}
</style>