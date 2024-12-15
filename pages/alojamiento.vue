<template>
  <DataTable ref="dt" :value="alojamiento" :loading="pending">
    <template #header>
      <div class="flex justify-between">
        <div class="flex gap-2 items-center">
          <Button
            icon="pi pi-file-excel"
            @click="exportToCSV()"
            severity="success"
            rounded
            raised
          />
        </div>
      </div>
    </template>
    <Column field="id" header="ID"></Column>
    <Column field="tipo" header="Tipo"></Column>
    <Column field="nombre" header="Nombre"></Column>
    <Column field="opcion" header="Opción"></Column>
    <Column field="estado" header="Estado"></Column>
  </DataTable>
</template>

<script setup lang="ts">
import { useRegistrationsStore } from "#imports";

const opcionesAlojamiento = [
  { id: 1, name: "Opción A" },
  { id: 2, name: "Opción A individual" },
  { id: 3, name: "Opción B" },
  { id: 4, name: "Opción B individual" },
  { id: 5, name: "Opción C" },
  { id: 6, name: "Opción C individual" },
];

const store = useRegistrationsStore();
await store.fetchRegistrations();
const { registrations, pending } = storeToRefs(store);
const dt = ref();

const exportToCSV = () => {
  dt.value.exportCSV();
};

const alojamiento = computed(() => {
  return registrations.value
    .filter((reg) => {
      return (
        reg.opciones.filter(
          (opc: any) => [1, 2, 3, 4, 5, 6].includes(opc.id) && opc.seleccionada
        ).length > 0
      );
    })
    .map((reg) => ({
      id: reg.id,
      tipo: reg.tipo === "pareja" ? "doble" : "individual",
      nombre:
        reg.full_name +
        (reg.tipo === "pareja"
          ? " y " + reg.nombre_pareja + " " + reg.apellidos_pareja
          : ""),
      opcion: opcionAlojamiento(reg.opciones),
      estado: reg.estado,
    }));
});

const opcionAlojamiento = (opciones: any[]) => {
  for (let i = 0; i < 6; i++) {
    if (opciones[i].seleccionada) {
      return opcionesAlojamiento[i].name;
    }
  }
};
</script>
