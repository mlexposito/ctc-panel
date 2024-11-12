<template>
  <div class="status-icon" :style="{ backgroundColor: color }"></div>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.status-icon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
