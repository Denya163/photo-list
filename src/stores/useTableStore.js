import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import axios from "axios";

export const useTableStore = defineStore("table", () => {
  const data = ref([]);
  const visibleRows = ref(30);
  const sortKey = ref(null);
  const sortOrder = ref(1);
  const albumIds = ref(localStorage.getItem("albumIds") || "");
  const isLoading = ref(false);
  const errorMessage = ref("");

  watch(albumIds, (newVal) => {
    localStorage.setItem("albumIds", newVal);
  });

  const fetchData = async () => {
    try {
      isLoading.value = true;
      errorMessage.value = "";

      let url = "https://jsonplaceholder.typicode.com/photos";
      const ids = albumIds.value.trim().split(" ").filter(Boolean);
      if (ids.length) {
        url += "?" + ids.map((id) => `albumId=${id}`).join("&");
      }

      const response = await axios.get(url);
      data.value = response.data;

      if (!data.value.length) {
        errorMessage.value = "Нет данных для отображения.";
      }
    } catch (error) {
      errorMessage.value = "Ошибка загрузки данных. Попробуйте позже.";
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      isLoading.value = false;
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

  const loadMoreRows = () => {
    visibleRows.value += 20;
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

  return {
    data,
    visibleRows,
    sortKey,
    sortOrder,
    albumIds,
    isLoading,
    errorMessage,
    visibleData,
    loadMoreRows,
    sortBy,
    fetchData,
  };
});
