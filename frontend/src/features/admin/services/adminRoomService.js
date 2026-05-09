import api from "../../../api/client";

import {
  assignEquipmentToRoom,
  removeEquipmentFromRoom,
} from "./adminEquipmentService";


// GET ALL ROOMS
export async function getAdminRooms() {

  const response =
    await api.get("/rooms");

  return response.data;
}


// GET ROOM BY ID
export async function getRoomById(id) {

  const response =
    await api.get(`/rooms/${id}`);

  return response.data;
}


// CREATE ROOM
export async function createRoom(data) {

  const roomData = {
    name: data.name,
    type: data.type,
    capacity: Number(data.capacity),
    description: data.description,
    max_booking_minutes:
      Number(data.max_booking_minutes),
    building_id: 1,
    status: data.status || "free",
  };

  // CREATE ROOM
  const response =
    await api.post(
      "/rooms",
      roomData
    );

  const createdRoom =
    response.data;

  // ASSIGN EQUIPMENT
  if (data.equipment_ids?.length) {

    for (const equipmentId of data.equipment_ids) {

      try {

        await assignEquipmentToRoom({
          room_id: Number(createdRoom.id),
          equipment_id: Number(equipmentId),
        });

      } catch (err) {

        console.error(
          "Assign equipment error",
          err.response?.data || err
        );
      }
    }
  }

  return createdRoom;
}


// UPDATE ROOM
export async function updateRoom(id, data) {

  // CURRENT ROOM
  const currentRoom =
    await getRoomById(id);

  const currentEquipmentIds =
    currentRoom.equipment?.map(
      (item) => Number(item.id)
    ) || [];

  const newEquipmentIds =
    (data.equipment_ids || []).map(
      Number
    );

  // EQUIPMENT TO ADD
  const equipmentToAdd =
    newEquipmentIds.filter(
      (equipmentId) =>
        !currentEquipmentIds.includes(
          equipmentId
        )
    );

  // EQUIPMENT TO REMOVE
  const equipmentToRemove =
    currentEquipmentIds.filter(
      (equipmentId) =>
        !newEquipmentIds.includes(
          equipmentId
        )
    );

  // ROOM DATA
  const roomData = {
    name: data.name,
    building_id: 1,
    capacity: Number(data.capacity),
    type: data.type,
    description: data.description,
    max_booking_minutes:
      Number(data.max_booking_minutes),
    status: data.status,
  };

  // UPDATE ROOM
  const response =
    await api.patch(
      `/rooms/${id}`,
      roomData
    );

  // ADD EQUIPMENT
  for (const equipmentId of equipmentToAdd) {

    try {

      await assignEquipmentToRoom({
        room_id: Number(id),
        equipment_id: Number(equipmentId),
      });

    } catch (err) {

      console.error(
        "Assign equipment error",
        err.response?.data || err
      );
    }
  }

  // REMOVE EQUIPMENT
  for (const equipmentId of equipmentToRemove) {

    try {

      await removeEquipmentFromRoom({
        room_id: Number(id),
        equipment_id: Number(equipmentId),
      });

    } catch (err) {

      console.error(
        "Remove equipment error",
        err.response?.data || err
      );
    }
  }

  return response.data;
}


// SET MAINTENANCE
export async function setRoomMaintenance(id) {

  const response =
    await api.patch(
      `/rooms/${id}`,
      {
        status: "maintenance",
      }
    );

  return response.data;
}