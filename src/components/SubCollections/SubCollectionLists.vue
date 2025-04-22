<template>
    <div class="">
        <div class="table-header text-4xl font-semibold mb-10 w-full ">
            <h1>Subcollections</h1>
        </div>
        <div>
            <button to="/subCollections/form" class="add-button items-center shadow-md" @click="addSubCollection">Add Subcollection</button>
        </div>
        <table class="subCollection-table ">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Subcollection Name</th>
                    <th>Collection Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(subCollection, index) in subCollections" :key="subCollection.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ subCollection.sub_collection_name }}</td>
                    <td>{{ subCollection.collection_name }}</td>
                    <td>
                        <button class="shadow-md" @click="editSubCollection(subCollection)">edit</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllSubCollections } from "../../composable/SubCollections/SubCollection";

export default {
    setup() {
        const subCollections = ref([]);
        const router = useRouter();

        const fetchSubCollections = async () => {
            const response = await getAllSubCollections();
            if (response.success) {
                subCollections.value = response.data;
            } else {
                console.error("⚠️ Error loading subCollections:", response.message);
            }
        };

        const editSubCollection = (subCollection) => {
            console.log("Editing subCollection:", subCollection.id);
            router.push({
                path: `/subCollections/form/${subCollection.id}`,
                state: { subCollection } // ส่งข้อมูลแบรนด์ไปใน state
            });
        };

        const addSubCollection = () => {
            router.push("/subCollections/form");
        };

        onMounted(fetchSubCollections);

        return { subCollections, editSubCollection, addSubCollection };
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
.subCollection-table {
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

/* ✅ ทำให้ปุ่ม Add SubCollection ชิดขวา */
.add-button:only-child {
    display: block;
    margin-left: auto;
}
</style>
