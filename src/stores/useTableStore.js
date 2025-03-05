import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export const useTableStore = defineStore("table", () => {
  const data = ref([]);
  const visibleRows = ref(30);
  const sortKey = ref(null);
  const sortOrder = ref(1);

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

  onMounted(fetchData);

  return {
    data,
    visibleRows,
    sortKey,
    sortOrder,
    visibleData,
    loadMoreRows,
    sortBy,
  };
});
