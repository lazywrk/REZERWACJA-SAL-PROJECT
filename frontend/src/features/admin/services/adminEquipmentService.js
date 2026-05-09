import api from "../../../api/client";


export async function getEquipment() {

  const response =
    await api.get("/equipment");

  return response.data;
}


export async function createEquipment(data) {

  const response =
    await api.post(
      "/equipment",
      data
    );

  return response.data;
}


export async function deleteEquipment(id) {

  const response =
    await api.delete(
      `/equipment/${id}`
    );

  return response.data;
}


export async function assignEquipmentToRoom(data) {

  const response =
    await api.post(
      "/equipment/assign",
      data
    );

  return response.data;
}


export async function removeEquipmentFromRoom(data) {

  const response =
    await api.post(
      "/equipment/unassign",
      data
    );

  return response.data;
}