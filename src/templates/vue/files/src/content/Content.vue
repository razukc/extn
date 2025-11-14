<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(true);

const handleClose = () => {
  visible.value = false;
};
</script>

<template>
  <div v-if="visible" class="content-overlay">
    <p>Extension loaded!</p>
    <button @click="handleClose">Close</button>
  </div>
</template>

<style scoped>
.content-overlay {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  font-family: system-ui, -apple-system, sans-serif;
}

p {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
}

button {
  padding: 4px 12px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #357ae8;
}

button:active {
  background-color: #2a5dc7;
}
</style>
