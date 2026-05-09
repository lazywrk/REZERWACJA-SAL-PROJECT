import { useEffect, useMemo, useState } from "react";

import { getMyBookings } from "../../bookings/services/bookingService";
import { getRooms } from "../../rooms/services/roomService";

export function useDashboardData() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [bookingsData, roomsData] = await Promise.all([
          getMyBookings(),
          getRooms(),
        ]);

        setBookings(bookingsData || []);
        setRooms(roomsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const roomNameById = useMemo(() => {
    const map = new Map();

    rooms.forEach((r) => {
      map.set(r.id, r.name);
    });

    return map;
  }, [rooms]);

  return {
    bookings,
    rooms,
    roomNameById,
    loading,
  };
}