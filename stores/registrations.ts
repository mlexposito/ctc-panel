import { defineStore } from "pinia";
import { useGFRestApi } from "~/composables/GFRestApi";
import { ref } from "vue";

export const useRegistrationsStore = defineStore("registrations", () => {
  const pending = ref(false);
  const error = ref(null as any);
  const registrations = ref([] as any[]);

  // Fetch Registrations
  async function fetchRegistrations() {
    pending.value = true;
    error.value = null;
    try {
      const data = await useGFRestApi().fetchFormEntries();
      registrations.value = mapRegistrations(data.entries);
    } catch (err) {
      error.value = err;
    } finally {
      pending.value = false;
    }
  }

  async function updateRegistrationStatus(entryId: number, newStatus: string) {
    pending.value = true;
    try {
      const currentEntry = await useGFRestApi().fetchEntry(entryId);
      currentEntry["8"] = newStatus;
      await useGFRestApi().updateEntry(entryId, currentEntry);
    } catch (err) {
      console.log(err);
    } finally {
      pending.value = false;
    }
  }

  async function deleteRegistration(entryId: number) {
    pending.value = true;
    try {
      await useGFRestApi().deleteEntry(entryId);
    } catch (err) {
      console.log(err);
    } finally {
      pending.value = false;
    }
  }

  async function sendPaymentNotification(entryId: number) {
    const PAYMENT_NOTIFICATION = "672f6e7035651";
    pending.value = true;
    try {
      await useGFRestApi().sendNotification(entryId, PAYMENT_NOTIFICATION);
    } catch (err) {
      console.log(err);
    } finally {
      pending.value = false;
    }
  }

  function mapRegistrations(GF_Entries: any) {
    const mappedRegistrations = GF_Entries.map((registration: any) => {
      const json_reg = JSON.parse(registration["5"]);
      return {
        entryId: registration.id,
        id: registration["1"],
        date_created: registration.date_created,
        estado: registration["8"] || "pendiente",
        full_name: `${json_reg.nombre} ${json_reg.apellidos}`,
        ...json_reg,
        in_hotel: (() => {
          for (const opcion of json_reg.opciones) {
            if ([1, 2, 3, 4, 5, 6].includes(opcion.id)) {
              if (opcion.seleccionada) {
                return "Si";
              }
            }
          }
          return "No";
        })(),
      };
    });
    return mappedRegistrations;
  }

  return {
    pending,
    error,
    registrations,
    fetchRegistrations,
    updateRegistrationStatus,
    deleteRegistration,
    sendPaymentNotification,
  };
});
