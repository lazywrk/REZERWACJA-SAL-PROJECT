const { sql } = require('../db');
const { roomDTO } = require('../DTO/roomDTO');
const { buildRoomCalendar } = require('../utils/calendarUtils');
const { getRoomStatus } = require('../utils/bookingUtils');

// ACTIVE BOOKINGS
async function getRoomActiveBookings(roomId) {
    const request = new sql.Request();

    request.input('roomId', sql.Int, roomId);

    const result = await request.query(`
        SELECT room_id, start_time, end_time
        FROM bookings
        WHERE room_id = @roomId
        AND status = 'active'
    `);

    return result.recordset;
}

// ROOMS
async function getRooms(filters = {}) {
    const request = new sql.Request();

    let query = `
        SELECT DISTINCT r.*, b.name AS building_name
        FROM rooms r
        LEFT JOIN buildings b ON r.building_id = b.id
        LEFT JOIN room_equipment re ON r.id = re.room_id
        WHERE 1=1
    `;

    // SEARCH (name)
    if (filters.search) {
        request.input('search', sql.VarChar, `%${filters.search}%`);
        query += ` AND r.name LIKE @search`;
    }

    // TYPE
    if (filters.type) {
        request.input('type', sql.VarChar, filters.type);
        query += ` AND r.type = @type`;
    }

    // CAPACITY (min)
    if (filters.capacity) {
        request.input('capacity', sql.Int, filters.capacity);
        query += ` AND r.capacity >= @capacity`;
    }

    // BUILDING
    if (filters.building) {
        request.input('building', sql.Int, filters.building);
        query += ` AND r.building_id = @building`;
    }

   // EQUIPMENT (fixed)
if (filters.equipment) {
    let equipment = filters.equipment;

    if (typeof equipment === "string") {
        equipment = equipment.split(",");
    }

    if (Array.isArray(equipment)) {
        equipment = equipment.map(Number);
    }

    if (equipment.length > 0) {
        query += `
            AND r.id IN (
                SELECT room_id
                FROM room_equipment
                WHERE equipment_id IN (${equipment.join(",")})
            )
        `;
    }
}

    const result = await request.query(query);
    const roomsData = result.recordset;

    // BOOKINGS для live_status
    const bookingsResult = await sql.query(`
        SELECT room_id, start_time, end_time
        FROM bookings
        WHERE status = 'active'
    `);

    const allBookings = bookingsResult.recordset;

    const now = new Date();

    const rooms = [];

    for (const room of roomsData) {

        const roomBookings = allBookings.filter(
            b => b.room_id === room.id
        );

        const live_status = getRoomStatus(room, roomBookings, now);

        rooms.push(roomDTO({
            ...room,
            status: room.status,
            live_status
        }));
    }

    return rooms;
}

// ROOM BY ID
async function getRoomById(id) {
    const request = new sql.Request();
    request.input('id', sql.Int, id);

    const result = await request.query(`
        SELECT r.*, b.name AS building_name
        FROM rooms r
        LEFT JOIN buildings b ON r.building_id = b.id
        WHERE r.id = @id
    `);

    const room = result.recordset[0];
    if (!room) return null;

    const bookings = await getRoomActiveBookings(id);

   
    const live_status = getRoomStatus(room, bookings, new Date());

    room.equipment = await getRoomEquipment(id);

    return roomDTO({
        ...room,
        status: room.status,
        live_status
    });
}

// EQUIPMENT
async function getRoomEquipment(roomId) {
    const request = new sql.Request();
    request.input('roomId', sql.Int, roomId);

    const result = await request.query(`
        SELECT e.id, e.name
        FROM equipment e
        JOIN room_equipment re ON e.id = re.equipment_id
        WHERE re.room_id = @roomId
    `);

    return result.recordset;
}

// CALENDAR
async function getRoomCalendar(roomId, date) {
    roomId = Number(roomId);

    const bookings = await getRoomActiveBookings(roomId);

    return buildRoomCalendar(roomId, date, bookings);
}

// CREATE ROOM
async function createRoom(data) {
    const request = new sql.Request();

    request.input('name', sql.VarChar, data.name);
    request.input('building_id', sql.Int, data.building_id);
    request.input('capacity', sql.Int, data.capacity);
    request.input('type', sql.VarChar, data.type);
    request.input('description', sql.VarChar, data.description);
    request.input('max_booking_minutes', sql.Int, data.max_booking_minutes);

    await request.query(`
        INSERT INTO rooms (name, building_id, capacity, type, status, description, max_booking_minutes)
        VALUES (@name, @building_id, @capacity, @type, 'free', @description, @max_booking_minutes)
    `);
}
// UPDATE ROOM
async function updateRoom(id, data) {

    const request =
        new sql.Request();

    request.input(
        'id',
        sql.Int,
        id
    );

    const fields = [];

    // NAME
    if (data.name !== undefined) {

        request.input(
            'name',
            sql.VarChar,
            data.name
        );

        fields.push(
            'name = @name'
        );
    }

    // BUILDING
    if (data.building_id !== undefined) {

        request.input(
            'building_id',
            sql.Int,
            data.building_id
        );

        fields.push(
            'building_id = @building_id'
        );
    }

    // CAPACITY
    if (data.capacity !== undefined) {

        request.input(
            'capacity',
            sql.Int,
            data.capacity
        );

        fields.push(
            'capacity = @capacity'
        );
    }

    // TYPE
    if (data.type !== undefined) {

        request.input(
            'type',
            sql.VarChar,
            data.type
        );

        fields.push(
            'type = @type'
        );
    }

    // DESCRIPTION
    if (data.description !== undefined) {

        request.input(
            'description',
            sql.VarChar(sql.MAX),
            data.description
        );

        fields.push(
            'description = @description'
        );
    }

    // MAX BOOKING MINUTES
    if (
        data.max_booking_minutes
        !== undefined
    ) {

        request.input(
            'max_booking_minutes',
            sql.Int,
            data.max_booking_minutes
        );

        fields.push(
            'max_booking_minutes = @max_booking_minutes'
        );
    }

    // STATUS
    if (data.status !== undefined) {

        const allowedStatuses = [
            'free',
            'maintenance'
        ];

        if (
            !allowedStatuses.includes(
                data.status
            )
        ) {

            throw new Error(
                'Niepoprawny status'
            );
        }

        request.input(
            'status',
            sql.VarChar,
            data.status
        );

        fields.push(
            'status = @status'
        );
    }

    // UPDATE ROOM
    if (fields.length) {

        await request.query(`
            UPDATE rooms
            SET ${fields.join(', ')}
            WHERE id = @id
        `);
    }

    // =========================
    // EQUIPMENT SYNC
    // =========================

    if (
        Array.isArray(
            data.equipment_ids
        )
    ) {

        // DELETE OLD
        const deleteRequest =
            new sql.Request();

        deleteRequest.input(
            'room_id',
            sql.Int,
            id
        );

        await deleteRequest.query(`
            DELETE FROM room_equipment
            WHERE room_id = @room_id
        `);

        // INSERT NEW
        for (
            const equipmentId
            of data.equipment_ids
        ) {

            const insertRequest =
                new sql.Request();

            insertRequest.input(
                'room_id',
                sql.Int,
                id
            );

            insertRequest.input(
                'equipment_id',
                sql.Int,
                equipmentId
            );

            await insertRequest.query(`
                INSERT INTO room_equipment (
                    room_id,
                    equipment_id
                )
                VALUES (
                    @room_id,
                    @equipment_id
                )
            `);
        }
    }

    // RETURN UPDATED ROOM
    const result =
        await sql.query`
            SELECT *
            FROM rooms
            WHERE id = ${id}
        `;

    return result.recordset[0];
}


// DELETE ROOM
async function deleteRoom(id) {
    const request = new sql.Request();
    request.input('id', sql.Int, id);

    await request.query(`DELETE FROM rooms WHERE id = @id`);
}

module.exports = {
    getRooms,
    getRoomById,
    getRoomEquipment,
    getRoomCalendar,
    getRoomActiveBookings,
    createRoom,
    updateRoom,
    deleteRoom
};