<template>
  <div class="flex flex-col items-center h-screen bg-gray-100 p-4">
    <div class="mb-4 flex gap-2">
      <input
        v-model="tableStore.albumIds"
        type="text"
        placeholder="Введите ID альбомов через пробел"
        class="border p-2 rounded-lg w-80"
      />
      <button
        @click="tableStore.fetchData"
        :disabled="tableStore.isLoading"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
      >
        <span
          v-if="tableStore.isLoading"
          class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"
        ></span>
        Поиск
      </button>
    </div>

    <div v-if="tableStore.errorMessage" class="text-red-500 mb-4">
      {{ tableStore.errorMessage }}
    </div>

    <div
      class="w-[600px] max-h-[550px] overflow-auto border border-gray-300 bg-white shadow-md rounded-lg"
      ref="tableWrapper"
      @scroll="handleScroll"
    >
      <table class="w-full border-collapse">
        <thead class="sticky top-0 bg-white shadow-md z-10">
          <tr class="bg-gray-200 text-gray-700">
            <th
              v-for="(header, key) in headers"
              :key="key"
              @click="sortTable(key)"
              class="p-3 border-b cursor-pointer hover:bg-gray-300 transition text-left"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in tableStore.visibleData"
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
import { ref } from "vue";
import { useTableStore } from "@/stores/useTableStore.js";

const tableStore = useTableStore();
const tableWrapper = ref(null);

const headers = {
  id: "Ид",
  albumId: "Альбом",
  title: "Название",
  url: "Ссылка",
  thumbnailUrl: "Миниатюра",
};

const sortTable = (key) => {
  tableStore.sortBy(key);
  if (tableWrapper.value) {
    tableWrapper.value.scrollTop = 0;
  }
};

const handleScroll = () => {
  if (!tableWrapper.value) return;
  const { scrollTop, scrollHeight, clientHeight } = tableWrapper.value;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    tableStore.loadMoreRows();
  }
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 8px;
  transition: background 0.3s;
}
</style>
