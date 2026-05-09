const sql = require('mssql');
const bcrypt = require('bcrypt');

require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),

    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

const TIME_SLOTS = [
    { start: '08:00', end: '09:30' },
    { start: '09:45', end: '11:15' },
    { start: '11:30', end: '13:00' },
    { start: '13:15', end: '14:45' },
    { start: '15:00', end: '16:30' },
    { start: '16:45', end: '18:15' }
];

const buildings = [
    ['Główny Kampus', 'Centrum'],
    ['Wydział Inżynierii', 'Północ'],
    ['Centrum Naukowe', 'Wschód'],
    ['Szkoła Biznesu', 'Zachód'],
    ['Wydział Medyczny', 'Południe'],
    ['Biblioteka Uniwersytecka', 'Centrum'],
    ['Instytut Informatyki', 'Strefa Technologiczna'],
    ['Wydział Prawa', 'Stare Miasto']
];

const equipmentList = [
    'Projektor',
    'Tablica',
    'Komputery',
    'Klimatyzacja',
    'Głośniki',
    'Mikrofon',
    'Telewizor',
    'Kamera',
    'Tablica Interaktywna',
    'WiFi',
    'Drukarka',
    'Skaner'
];

const roomTypes = [
    'lecture',
    'laboratory',
    'seminar',
    'conference',
    'computer'
];

async function seed() {

    try {

        await sql.connect(config);

        console.log('=========================');
        console.log('ROZPOCZYNANIE SEED');
        console.log('=========================');

        console.log('Czyszczenie bazy danych...');

        await sql.query(`DELETE FROM bookings`);
        await sql.query(`DELETE FROM room_equipment`);
        await sql.query(`DELETE FROM rooms`);
        await sql.query(`DELETE FROM equipment`);
        await sql.query(`DELETE FROM buildings`);
        await sql.query(`DELETE FROM users`);

        await sql.query(`DBCC CHECKIDENT ('users', RESEED, 0)`);
        await sql.query(`DBCC CHECKIDENT ('buildings', RESEED, 0)`);
        await sql.query(`DBCC CHECKIDENT ('equipment', RESEED, 0)`);
        await sql.query(`DBCC CHECKIDENT ('rooms', RESEED, 0)`);
        await sql.query(`DBCC CHECKIDENT ('bookings', RESEED, 0)`);

        console.log('Baza danych wyczyszczona');

        console.log('Tworzenie użytkowników...');

        const adminPass = await bcrypt.hash('Admin123!', 10);
        const managerPass = await bcrypt.hash('Manager123!', 10);
        const studentPass = await bcrypt.hash('Student123!', 10);

        await sql.query`
            INSERT INTO users (
                email,
                password,
                role
            )
            VALUES (
                'admin@uczelnia.pl',
                ${adminPass},
                'admin'
            )
        `;

        for (let i = 1; i <= 3; i++) {

            await sql.query`
                INSERT INTO users (
                    email,
                    password,
                    role
                )
                VALUES (
                    ${`manager${i}@uczelnia.pl`},
                    ${managerPass},
                    'manager'
                )
            `;
        }

        for (let i = 1; i <= 180; i++) {

            await sql.query`
                INSERT INTO users (
                    email,
                    password,
                    role
                )
                VALUES (
                    ${`student${i}@uczelnia.pl`},
                    ${studentPass},
                    'student'
                )
            `;
        }

        console.log('Użytkownicy utworzeni');

        console.log('Tworzenie budynków...');

        for (const building of buildings) {

            await sql.query`
                INSERT INTO buildings (
                    name,
                    location
                )
                VALUES (
                    ${building[0]},
                    ${building[1]}
                )
            `;
        }

        console.log('Budynki utworzone');

        const buildingResult = await sql.query`
            SELECT id FROM buildings ORDER BY id
        `;

        const buildingIds =
            buildingResult.recordset.map(b => b.id);

        console.log('Tworzenie wyposażenia...');

        for (const item of equipmentList) {

            await sql.query`
                INSERT INTO equipment (
                    name
                )
                VALUES (
                    ${item}
                )
            `;
        }

        console.log('Wyposażenie utworzone');

        console.log('Tworzenie sal...');

        let roomCount = 0;
        const roomIds = [];

        for (const buildingId of buildingIds) {

            for (let floor = 1; floor <= 4; floor++) {

                for (let roomNumber = 1; roomNumber <= 5; roomNumber++) {

                    roomCount++;

                    const roomName =
                        `Sala ${buildingId}${floor}${roomNumber}`;

                    const roomInsert = await sql.query`
                        INSERT INTO rooms (
                            name,
                            building_id,
                            capacity,
                            type,
                            status,
                            max_booking_minutes,
                            description
                        )
                        OUTPUT INSERTED.id
                        VALUES (
                            ${roomName},
                            ${buildingId},
                            ${rand(20, 180)},
                            ${pick(roomTypes)},
                            'free',
                            ${pick([90, 120, 180])},
                            'Nowoczesna sala uniwersytecka'
                        )
                    `;

                    roomIds.push(
                        roomInsert.recordset[0].id
                    );
                }
            }
        }

        console.log('Sale utworzone:', roomCount);

        console.log('Przypisywanie wyposażenia...');

        for (const roomId of roomIds) {

            const selectedEquipment = shuffle(
                Array.from(
                    { length: equipmentList.length },
                    (_, i) => i + 1
                )
            ).slice(0, rand(3, 6));

            for (const equipmentId of selectedEquipment) {

                await sql.query`
                    INSERT INTO room_equipment (
                        room_id,
                        equipment_id
                    )
                    VALUES (
                        ${roomId},
                        ${equipmentId}
                    )
                `;
            }
        }

        console.log('Wyposażenie przypisane');

        console.log('Tworzenie rezerwacji...');

        const now = new Date();
        const endDate = new Date('2027-06-30');

        let createdBookings = 0;
        let attempts = 0;

        while (
            createdBookings < 450 &&
            attempts < 4000
        ) {

            attempts++;

            const totalDays =
                Math.floor(
                    (endDate - now) /
                    (1000 * 60 * 60 * 24)
                );

            const randomDayOffset =
                rand(-10, totalDays);

            const slot = pick(TIME_SLOTS);

            const bookingDate = new Date(now);

            bookingDate.setDate(
                bookingDate.getDate() +
                randomDayOffset
            );

            const dayStr =
                bookingDate.toISOString().split('T')[0];

            const start = new Date(
                `${dayStr}T${slot.start}:00`
            );

            const end = new Date(
                `${dayStr}T${slot.end}:00`
            );

            const roomId = pick(roomIds);

            const userId = rand(5, 184);

            const conflict = await sql.query`
                SELECT id
                FROM bookings
                WHERE room_id = ${roomId}
                AND status = 'active'
                AND start_time < ${end}
                AND end_time > ${start}
            `;

            if (conflict.recordset.length > 0) {
                continue;
            }

            await sql.query`
                INSERT INTO bookings (
                    user_id,
                    room_id,
                    start_time,
                    end_time,
                    status
                )
                VALUES (
                    ${userId},
                    ${roomId},
                    ${start},
                    ${end},
                    'active'
                )
            `;

            createdBookings++;
        }

        console.log(
            'Rezerwacje utworzone:',
            createdBookings
        );

        console.log('');
        console.log('=========================');
        console.log('SEED ZAKOŃCZONY');
        console.log('=========================');
        console.log('');

        console.log('KONTO ADMINA');
        console.log('Email: admin@uczelnia.pl');
        console.log('Hasło: Admin123!');
        console.log('');

        process.exit(0);

    } catch (err) {

        console.error('');
        console.error('BŁĄD SEED');
        console.error(err);

        process.exit(1);
    }
}

seed();