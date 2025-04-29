<template>
    <div class="">
        <!-- 🔍 Search & Filter Controls -->
        <div class="flex justify-between items-center mb-6 w-full">
            <div class="flex gap-4 items-center">
                <!-- Subcollection Name Input -->
                <input type="text" v-model="filterSubName" @input="fetchSubCollections"
                    placeholder="Search subcollection name"
                    class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

                <!-- Collection Name Dropdown -->
                <select v-model="filterCollectionName" @change="fetchSubCollections"
                    class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">All Collections</option>
                    <option v-for="col in collectionList" :key="col.id" :value="col.collection_name">
                        {{ col.collection_name }}
                    </option>
                </select>

                <select v-model="filterStatus" @change="fetchSubCollections"
                    class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <!-- Add Button -->
            <button class="add-button shadow-md" @click="addSubCollection">
                Add Subcollection
            </button>
        </div>
        <table class="subCollection-table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Subcollection Name</th>
                    <th>Collection Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(subCollection, index) in subCollections" :key="subCollection.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <div class="ellipsis-2-lines">
                            {{ subCollection.sub_collection_name }}
                        </div>
                    </td>
                    <td>
                        <div class="ellipsis-2-lines">
                            {{ subCollection.collection_name }}
                        </div>
                    </td>
                    <td>
                        <div class="ellipsis-2-lines">{{ subCollection.status }}</div>
                    </td>
                    <td>
                        <button class="shadow-md" @click="editSubCollection(subCollection)">
                            edit
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getAllSubCollections } from "../../composable/SubCollections/SubCollection";
import { getAllCollections } from "../../composable/Collections/Collections";
import debounce from "lodash.debounce";

export default {
    setup() {
        const subCollections = ref([]);
        const router = useRouter();
        const collectionList = ref([]);
        const filterSubName = ref("");
        const filterCollectionName = ref("");
        const filterStatus = ref("");

        const fetchSubCollections = async () => {
            const params = {};
            if (filterSubName.value.trim()) {
                params.sub_collection_name = filterSubName.value.trim();
            }
            if (filterCollectionName.value) {
                params.collection_name = filterCollectionName.value;
            }
            if (filterStatus.value) {
                params.status = filterStatus.value;
            }
            const response = await getAllSubCollections(params);
            if (response.success) {
                subCollections.value = response.data;
            } else {
                console.error("⚠️ Error loading subCollections:", response.message);
            }
        };

        const fetchCollections = async () => {
            const res = await getAllCollections();
            if (res.success) {
                collectionList.value = res.data;
            }
        };

        const editSubCollection = (subCollection) => {
            console.log("Editing subCollection:", subCollection.id);
            router.push({
                path: `/subcollections/form/${subCollection.id}`,
            });
        };

        const addSubCollection = () => {
            router.push("/subcollections/form");
        };

        const debouncedFetch = debounce(fetchSubCollections, 400);

        watch([filterSubName, filterCollectionName, filterStatus], debouncedFetch);

        onMounted(async () => {
            await fetchCollections();
            await fetchSubCollections();
        });

        return {
            subCollections,
            editSubCollection,
            addSubCollection,
            collectionList,
            filterCollectionName,
            filterSubName,
            filterStatus, 
            fetchSubCollections,
        };
    },
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
.subCollection-table {
    width: 100%;
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
    vertical-align: middle;
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

.add-button {
    background-color: var(--color-primary);
    padding: 8px 16px;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-bottom: 16px;
}

/* ✅ ทำให้ปุ่ม Add SubCollection ชิดขวา */
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
