import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminRoomTable from "../components/AdminRoomTable";

import {
  getAdminRooms,
  setRoomMaintenance,
} from "../services/adminRoomService";

function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await getAdminRooms();
        setRooms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRooms();
  }, []);

  async function handleMaintenance(id) {
    const confirmed = window.confirm(
      "Czy na pewno ustawić salę w tryb konserwacji?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(id);

      await setRoomMaintenance(id);

      setRooms((prev) =>
        prev.map((room) =>
          room.id === id
            ? {
                ...room,
                status: "maintenance",
              }
            : room
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
        <div className="text-center">
          <div
            className="
              w-14 h-14
              border-4 border-white/10
              border-t-cyan-400
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-6 text-slate-400 text-lg">
            Ładowanie sal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] overflow-hidden">
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_35%)]
          pointer-events-none
        "
      />

      <div className="relative z-10 p-4 sm:p-6 lg:p-10 space-y-8">
        <div
          className="
            rounded-[32px]
            border border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            p-6 sm:p-8
          "
        >
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4 py-2
                  rounded-full
                  border border-cyan-400/20
                  bg-cyan-400/10
                  text-cyan-300
                  text-sm
                  font-medium
                  mb-5
                "
              >
                Zarządzanie salami
              </div>

              <h1
                className="
                  text-4xl
                  sm:text-5xl
                  font-black
                  tracking-tight
                  text-white
                "
              >
                Sale uczelniane
              </h1>

              <p className="mt-4 text-slate-400 max-w-2xl text-base sm:text-lg">
                Zarządzaj salami, dostępnością oraz statusem
                rezerwacji w nowoczesnym panelu administracyjnym.
              </p>
            </div>

            <Link
              to="/admin/rooms/create"
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-cyan-400
                hover:bg-cyan-300
                text-slate-950
                px-6 py-4
                font-semibold
                transition-all
                duration-300
                hover:scale-[1.02]
                shadow-[0_20px_60px_rgba(34,211,238,0.35)]
              "
            >
              <span className="text-xl">
                +
              </span>

              Dodaj salę
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div
            className="
              rounded-3xl
              border border-white/10
              bg-white/[0.03]
              backdrop-blur-xl
              p-6
            "
          >
            <p className="text-slate-500 text-sm">
              Wszystkie sale
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {rooms.length}
            </h2>
          </div>

          <div
            className="
              rounded-3xl
              border border-emerald-500/10
              bg-emerald-500/[0.07]
              backdrop-blur-xl
              p-6
            "
          >
            <p className="text-emerald-300 text-sm">
              Dostępne
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {
                rooms.filter(
                  (room) =>
                    room.status !== "maintenance"
                ).length
              }
            </h2>
          </div>

          <div
            className="
              rounded-3xl
              border border-orange-500/10
              bg-orange-500/[0.07]
              backdrop-blur-xl
              p-6
            "
          >
            <p className="text-orange-300 text-sm">
              W konserwacji
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {
                rooms.filter(
                  (room) =>
                    room.status === "maintenance"
                ).length
              }
            </h2>
          </div>
        </div>

        <AdminRoomTable
          rooms={rooms}
          onMaintenance={handleMaintenance}
          updatingId={updatingId}
        />
      </div>
    </div>
  );
}

export default AdminRoomsPage;