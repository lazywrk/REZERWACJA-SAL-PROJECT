function roomDTO(room) {
    return {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        type: room.type,
        description: room.description,
        building_name: room.building_name,
        equipment: room.equipment || [],

        // DB статус (free / maintenance)
        status: room.status,

        // реальний статус (free / occupied)
        live_status: room.live_status
    };
}

module.exports = { roomDTO };