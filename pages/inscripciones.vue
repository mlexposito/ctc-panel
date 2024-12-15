<template>
  <Toast />
  <ConfirmDialog />
  <div v-if="error">{{ error }}</div>

  <div class="p-8">
    <DataTable
      ref="dt"
      v-model:filters="filters"
      :value="registrations"
      paginator
      :rows="10"
      stripedRows
    >
      <template #header>
        <div class="flex justify-between">
          <div class="flex gap-2 items-center">
            <Button
              icon="pi pi-refresh"
              @click="refreshRegistrations()"
              severity="help"
              :loading="pending"
              rounded
              raised
            />
            <Button
              icon="pi pi-file-excel"
              @click="exportToCSV()"
              severity="success"
              rounded
              raised
            />
            <div v-if="pending">Cargando...</div>
          </div>

          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="Buscar..."
            />
          </IconField>
        </div>
      </template>
      <template #empty>Ningún registro encontrado. </template>
      <Column header="">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            @click="registrationDialogShow(slotProps.data)"
            rounded
          />
        </template>
      </Column>
      <Column field="id" header="ID"></Column>
      <Column field="tipo" header="Tipo"></Column>
      <Column field="full_name" header="Nombre"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="in_hotel" header="Hotel"></Column>
      <Column field="importe" header="Importe">
        <template #body="slotProps"
          ><div class="text-center">
            {{ slotProps.data.importe }} €
          </div></template
        >
      </Column>
      <Column field="estado" header="Estado">
        <template #body="slotProps"
          ><Chip
            :label="slotProps.data.estado"
            :style="'background-color:' + estadoBgColor(slotProps.data.estado)"
          ></Chip>
        </template>
      </Column>
    </DataTable>
  </div>
  <Dialog
    v-model:visible="registrationDialog.visible"
    modal
    :header="'Inscripción ID: ' + (registrationDialog.current as any)?.id "
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <pre>{{ (registrationDialog.current as any)?.resumen }}</pre>
    <template #footer>
      <div class="w-full flex justify-between pt-4">
        <SelectButton v-model="registrationDialog.newStatus" :options="status">
          <template #option="slotProps" style="background-color: red">
            {{ slotProps.option }}
          </template>
        </SelectButton>
        <div class="flex gap-2">
          <Button
            label="Eliminar"
            severity="danger"
            :loading="pending"
            @click="confirmDelete((registrationDialog.current as any)?.entryId)"
          />
          <Button
            label="Actualizar"
            :loading="pending"
            @click="updateRegistrationStatus()"
            :disabled="registrationDialog.newStatus === (registrationDialog.current as any)?.estado"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useRegistrationsStore } from "#imports";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Chip from "primevue/chip";
import { FilterMatchMode } from "@primevue/core/api";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import Dialog from "primevue/dialog";

const confirm = useConfirm();
const toast = useToast();
const dt = ref();

const exportToCSV = () => {
  dt.value.exportCSV();
};

const confirmDelete = (entryId: number) =>
  confirm.require({
    message: "¿Estas seguro de querer eliminar la inscripción?",
    header: "Eliminar inscripción",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Eliminar",
      severity: "danger",
    },
    accept: async () => {
      await deleteRegistration(entryId);
      registrationDialogHide();
      toast.add({
        severity: "success",
        summary: "Inscripción eliminada",
        detail: "Inscripción eliminada correctamente",
        life: 3000,
      });
    },
    reject: () => {},
  });

const store = useRegistrationsStore();
const { registrations, error, pending } = storeToRefs(store);
const refreshRegistrations = async () => {
  await store.fetchRegistrations();
};

await refreshRegistrations();

const status = ["pendiente", "pagado"];

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const registrationDialog = ref({
  visible: false,
  current: null,
  newStatus: "",
});

const updateRegistrationStatus = async () => {
  if (pending.value) return;

  await store.updateRegistrationStatus(
    (registrationDialog.value.current as any)?.entryId,
    registrationDialog.value.newStatus
  );
  await refreshRegistrations();

  // si se actualiza a otro estado que no sea pagado
  if (registrationDialog.value.newStatus != "pagado") {
    registrationDialogHide();
    toast.add({
      severity: "success",
      summary: "Inscripción actualizada",
      detail: "Estado actualizado correctamente",
      life: 3000,
    });
    return;
  }

  // si se actualiza a pagado
  if (registrationDialog.value.newStatus === "pagado") {
    confirm.require({
      message: "¿Enviar correo de confirmación de pago?",
      header: "Confirmar pago",
      rejectProps: {
        label: "No",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "Si",
        severity: "success",
      },
      accept: async () => {
        await store.sendPaymentNotification(
          (registrationDialog.value.current as any)?.entryId
        );
        registrationDialogHide();
        toast.add({
          severity: "success",
          summary: "Correo enviado",
          detail: "Correo enviado correctamente",
          life: 3000,
        });
      },
      reject: () => {
        registrationDialogHide();
        toast.add({
          severity: "success",
          summary: "Inscripción actualizada",
          detail: "Estado actualizado correctamente",
          life: 3000,
        });
      },
    });
  }
};

const deleteRegistration = async (entryId: number) => {
  if (pending.value) return;
  await store.deleteRegistration(entryId);
  await refreshRegistrations();
};

const registrationDialogShow = (registration: any) => {
  registrationDialog.value.visible = true;
  registrationDialog.value.current = registration;
  registrationDialog.value.newStatus = registration.estado;
};

const registrationDialogHide = () => {
  registrationDialog.value.current = null;
  registrationDialog.value.newStatus = "";
  registrationDialog.value.visible = false;
};

const estadoBgColor = (estado: string) => {
  switch (estado) {
    case "pendiente":
      return "#fef9c3";
    case "pagado":
      return "#d9f99d";
  }
};
</script>
