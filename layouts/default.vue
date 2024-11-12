<template>
  <Menubar :model="items" />
  <slot />
</template>

<script setup lang="ts">
import Menubar from "primevue/menubar";
import "primeicons/primeicons.css";
import { ref } from "vue";

const items = ref([
  {
    label: "Inicio",
    icon: "pi pi-chart-bar",
    url: "/",
  },
  {
    label: "Inscripciones",
    icon: "pi pi-users",
    url: "/inscripciones",
  },
  {
    label: "Clases",
    icon: "pi pi-graduation-cap",
    url: "/clases",
  },
  {
    label: "Alojamiento",
    icon: "pi pi-home",
    url: "/alojamiento",
  },
]);
</script>
