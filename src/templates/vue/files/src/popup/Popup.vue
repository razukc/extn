<script setup lang="ts">
import { ref, onMounted } from 'vue';

const count = ref(0);
const currentTab = ref<chrome.tabs.Tab | null>(null);

onMounted(() => {
  // Load saved count from storage
  chrome.storage.local.get(['count'], (result) => {
    if (result.count !== undefined) {
      count.value = result.count;
    }
  });

  // Get current tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      currentTab.value = tabs[0];
    }
  });
});

const handleIncrement = () => {
  count.value++;
  chrome.storage.local.set({ count: count.value });
};
</script>

<template>
  <div class="popup">
    <h1>{{projectName}}</h1>
    <p>Count: {{ count }}</p>
    <button @click="handleIncrement">Increment</button>
    <p v-if="currentTab" class="tab-info">Current tab: {{ currentTab.title }}</p>
  </div>
</template>

<style scoped>
.popup {
  width: 300px;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #333;
}

p {
  margin: 8px 0;
  color: #666;
}

button {
  padding: 8px 16px;
  margin: 10px 0;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #357ae8;
}

button:active {
  background-color: #2a5dc7;
}

.tab-info {
  font-size: 12px;
  color: #999;
  margin-top: 16px;
  word-break: break-word;
}
</style>
