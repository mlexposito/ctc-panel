<template>
  <Panel v-for="(clase, idx) in clases" :key="idx" :header="clase">
    <div v-if="pending" class="w-full">
      <ProgressSpinner />
    </div>
    <div class="w-full flex flex-col gap-2">
      <div
        v-for="attendant in getAttendants(idx)"
        :key="attendant.id"
        class="w-full flex items-center gap-2"
      >
        {{ attendant.id }}: {{ attendant.pareja }}
        <StatusIcon
          :color="attendant.estado === 'pendiente' ? 'red' : 'green'"
        />
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { useRegistrationsStore } from "#imports";

const store = useRegistrationsStore();
store.fetchRegistrations();
const { registrations, error, pending } = storeToRefs(store);

const clases = [
  "Taller 1: Secretos del abrazo y caminar",
  "Taller 2: Flexibilidad en el abrazo",
  "Taller 3: Barrida",
  "Taller 4: Milonga 1",
  "Taller 5: Tango Vals",
  "Taller 6: Milonga 2",
];

const getAttendants = (idx: number): any[] => {
  return registrations.value
    .filter((r) => r.talleres[idx].seleccionada)
    .map((r) => ({
      id: r.id,
      pareja: r.full_name + " y " + r.nombre_pareja + " " + r.apellidos_pareja,
      estado: r.estado,
    }));
};
</script>
