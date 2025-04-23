<template>
    <div class="">
        <div class="table-header text-4xl font-semibold mb-10 w-full ">
            <h1>Brands</h1>
        </div>
        <div>
            <button to="/brands/form" class="add-button items-center shadow-md" @click="addBrand">Add Brand</button>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllBrands } from "../../composable/Brands/Brands";

export default {
    setup() {
        const brands = ref([]);
        const router = useRouter();

        const fetchBrands = async () => {
            const response = await getAllBrands();
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

        onMounted(fetchBrands);

        return { brands, editBrand, addBrand };
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

.add-button {
    background-color: var(--color-primary);
    padding: 8px 16px;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-bottom: 16px;
}

/* ✅ ทำให้ปุ่ม Add Brand ชิดขวา */
.add-button:only-child {
    display: block;
    margin-left: auto;
}
</style>