import { useRegistrationsStore } from "#imports";
export const useStats = async () => {
  const store = useRegistrationsStore();
  const { registrations, error, pending } = storeToRefs(store);
  await store.fetchRegistrations();

  const opcionesIds = {
    viernes: [1, 2, 3, 4, 7, 8, 9, 10],
    sabado: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
    domingo: [1, 2, 7, 8, 9, 14],
  };

  const setAttendance = (tipo: string, day: any) => {
    switch (tipo) {
      case "conductor":
        day.leader = 1;
        break;
      case "seguidor":
        day.follower = 1;
        break;
      case "pareja":
        day.leader = 1;
        day.follower = 1;
        break;
    }
  };

  const milongasAttendants = registrations.value.reduce(
    (acc, reg) => {
      let viernes = { leader: 0, follower: 0 };
      let sabado = { leader: 0, follower: 0 };
      let domingo = { leader: 0, follower: 0 };

      for (let opcion of reg.opciones) {
        if (opcionesIds.viernes.includes(opcion.id)) {
          if (opcion.seleccionada) {
            setAttendance(reg.tipo, viernes);
          }
        }
        if (opcionesIds.sabado.includes(opcion.id)) {
          if (opcion.seleccionada) {
            setAttendance(reg.tipo, sabado);
          }
        }
        if (opcionesIds.domingo.includes(opcion.id)) {
          if (opcion.seleccionada) {
            setAttendance(reg.tipo, domingo);
          }
        }
      }
      acc.viernes.leaders += viernes.leader;
      acc.viernes.followers += viernes.follower;
      acc.sabado.leaders += sabado.leader;
      acc.sabado.followers += sabado.follower;
      acc.domingo.leaders += domingo.leader;
      acc.domingo.followers += domingo.follower;
      return acc;
    },
    {
      viernes: { leaders: 0, followers: 0 },
      sabado: { leaders: 0, followers: 0 },
      domingo: { leaders: 0, followers: 0 },
    }
  );

  const talleresAttendants = registrations.value.reduce(
    (acc, reg) => {
      for (let taller of reg.talleres) {
        if (taller.seleccionada) {
          acc[taller.id - 1] += 1;
        }
      }
      return acc;
    },
    [0, 0, 0, 0, 0, 0]
  );

  return {
    pending,
    milongasAttendants,
    talleresAttendants,
  };
};
