<template>
    <div class="">
        <div class="flex justify-between items-center mb-6 w-full">
            <div class="flex gap-4 items-center">
                <!-- Subcollection Name Input -->
                <input type="text" v-model="filterCollectionName" @input="fetchCollections"
                    placeholder="Search collection name"
                    class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

                <!-- Collection Name Dropdown -->
                <select v-model="filterBrandName" @change="fetchCollections"
                    class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">All Brands</option>
                    <option v-for="col in brandNameList" :key="col.id" :value="col.brand_name">
                        {{ col.brand_name }}
                    </option>
                </select>
            </div>
            <button to="/collections/form" class="add-button items-center shadow-md" @click="addCollection">Add
                Collection</button>
        </div>
        <table class="collection-table ">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Collection Name</th>
                    <th>Brand Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(collection, index) in collections" :key="collection.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <div class="ellipsis-2-lines">{{ collection.collection_name }}</div>
                    </td>
                    <td>
                        <div class="ellipsis-2-lines">{{ collection.brand_name }}</div>
                    </td>
                    <td>
                        <button class="shadow-md" @click="editCollection(collection)">edit</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getAllCollections } from "../../composable/Collections/Collections";
import { getAllBrands } from "../../composable/Brands/Brands"
import debounce from "lodash.debounce";

export default {
    setup() {
        const collections = ref([]);
        const router = useRouter();
        const filterCollectionName = ref("");
        const filterBrandName = ref("");
        const brandNameList = ref([]);

        const fetchCollections = async () => {
            const params = {};
            if (filterCollectionName.value.trim()) {
                params.collection_name = filterCollectionName.value.trim();
            }
            if (filterBrandName.value) {
                params.brand_name = filterBrandName.value;
            }

            const response = await getAllCollections(params);
            if (response.success) {
                collections.value = response.data;
            } else {
                console.error("⚠️ Error loading brands:", response.message);
            }
        };

        const fetchBrands = async () => {
            const res = await getAllBrands();
            if (res.success) {
                brandNameList.value = res.data;
            }
        }

        const editCollection = (collection) => {
            console.log("Editing collection:", collection.id);
            router.push({
                path: `/collections/form/${collection.id}`,
            });
        };

        const addCollection = () => {
            router.push("/collections/form");
        };

        const debouncedFetch = debounce(fetchCollections, 400);

        watch([filterCollectionName, filterBrandName], debouncedFetch);

        onMounted(async () => {
            await fetchCollections();
            await fetchBrands();
        });


        return { collections, editCollection, addCollection, brandNameList, filterBrandName, filterCollectionName, fetchCollections };
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
.collection-table {
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

/* ✅ ทำให้ปุ่ม Add Collection ชิดขวา */
.add-button:only-child {
    display: block;
    margin-left: auto;
}

.ellipsis-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4em;
    max-height: 2.8em;
    /* = 2 lines */
}

/* ✅ Responsive สำหรับหน้าจอเล็ก */
@media (max-width: 640px) {

    input[type="text"],
    select {
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

    .flex {
        flex-wrap: wrap;
        gap: 8px;
    }

    .flex.justify-between {
        flex-direction: column;
        align-items: flex-start;
    }

    .add-button {
        margin-top: 10px;
        align-self: flex-end;
    }
}
</style>
