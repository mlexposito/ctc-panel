<template>
  <div class="w-full flex flex-col gap-2 p-8">
    <Card>
      <template #title>Milongas (ocupación)</template>
      <template #content>
        <Chart type="bar" :data="setChartDataMilongas()" />
      </template>
    </Card>
    <Card>
      <template #title>Talleres (ocupación)</template>
      <template #content>
        <Chart
          type="bar"
          :data="setChartDataTalleres()"
          :options="{ indexAxis: 'y' }"
        />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useStats } from "../composables/Stats";

const { pending, milongasAttendants, talleresAttendants } = await useStats();

const setChartDataMilongas = () => {
  return {
    labels: ["Viernes Noche", "Sábado Noche", "Domingo Noche"],
    datasets: [
      {
        label: "Conductores",
        backgroundColor: "blue",
        data: [
          milongasAttendants.viernes.leaders,
          milongasAttendants.sabado.leaders,
          milongasAttendants.domingo.leaders,
        ],
      },
      {
        label: "Seguidores",
        backgroundColor: "pink",
        data: [
          milongasAttendants.viernes.followers,
          milongasAttendants.sabado.followers,
          milongasAttendants.domingo.followers,
        ],
      },
    ],
  };
};

const setChartDataTalleres = () => {
  return {
    labels: ["Clase 1", "Clase 2", "Clase 3", "Clase 4", "Clase 5", "Clase 6"],
    datasets: [
      {
        label: "Parejas",
        backgroundColor: "blue",
        data: talleresAttendants,
      },
    ],
  };
};
</script>
