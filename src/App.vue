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
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Поиск
      </button>
    </div>
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
              @click="tableStore.sortBy(key)"
              class="p-3 border-b cursor-pointer hover:bg-gray-300 transition text-left truncate"
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

const handleScroll = () => {
  if (!tableWrapper.value) return;
  const { scrollTop, scrollHeight, clientHeight } = tableWrapper.value;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    tableStore.loadMoreRows();
  }
};
</script>
