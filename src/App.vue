<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div
      class="w-[600px] h-[600px] overflow-y-auto border border-gray-300 bg-white shadow-md rounded-lg p-2"
      @scroll="handleScroll"
      ref="tableWrapper"
    >
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th
              v-for="(header, key) in headers"
              :key="key"
              @click="sortBy(key)"
              class="p-3 border-b cursor-pointer hover:bg-gray-300 transition text-left truncate"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in visibleData"
            :key="row.id"
            class="border-b hover:bg-gray-100"
          >
            <td
              v-for="(header, key) in headers"
              :key="key"
              :title="row[key]"
              class="p-3 truncate max-w-[100px] overflow-hidden text-ellipsis"
            >
              <template v-if="key === 'thumbnailUrl'">
                <img
                  :src="row[key]"
                  :alt="row.title"
                  class="w-12 h-12 rounded-lg border border-gray-300"
                />
              </template>
              <template v-else-if="key === 'url'">
                <a
                  :href="row[key]"
                  class="text-blue-500 underline truncate block max-w-[100px]"
                  >{{ row[key] }}</a
                >
              </template>
              <template v-else>
                {{ row[key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const headers = {
  id: "Ид",
  albumId: "Альбом",
  title: "Название",
  url: "Ссылка",
  thumbnailUrl: "Миниатюра",
};

const data = ref([]);
const visibleRows = ref(30);
const sortKey = ref(null);
const sortOrder = ref(1);
const tableWrapper = ref(null);

const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/photos"
    );
    data.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
};

const visibleData = computed(() => {
  let sortedData = [...data.value].slice(0, visibleRows.value);
  if (sortKey.value) {
    sortedData.sort((a, b) => {
      if (a[sortKey.value] < b[sortKey.value]) return -1 * sortOrder.value;
      if (a[sortKey.value] > b[sortKey.value]) return 1 * sortOrder.value;
      return 0;
    });
  }
  return sortedData;
});

const handleScroll = () => {
  if (!tableWrapper.value) return;
  const { scrollTop, scrollHeight, clientHeight } = tableWrapper.value;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    visibleRows.value += 20;
  }
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value *= -1;
  } else {
    sortKey.value = key;
    sortOrder.value = 1;
  }
  visibleRows.value = 30;
};

onMounted(fetchData);
</script>
