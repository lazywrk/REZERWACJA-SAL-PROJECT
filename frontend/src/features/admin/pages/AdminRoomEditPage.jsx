import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import AdminRoomForm from "../components/AdminRoomForm";

import {
  getRoomById,
  updateRoom,
} from "../services/adminRoomService";

function AdminRoomEditPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [room, setRoom] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadRoom() {
      try {
        const data =
          await getRoomById(id);

        setRoom(data);

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    }

    loadRoom();

  }, [id]);

  async function handleUpdate(data) {
    try {
      await updateRoom(id, data);

      navigate("/admin/rooms");

    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-6">

        <div className="flex flex-col items-center gap-5">

          <div className="w-14 h-14 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin" />

          <div className="text-center">
            <p className="text-white text-lg font-medium">
              Ładowanie sali
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Pobieranie danych pomieszczenia...
            </p>
          </div>

        </div>

      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-6">

        <div className="max-w-md w-full rounded-[32px] border border-red-500/20 bg-red-500/10 backdrop-blur-xl p-8 text-center">

          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">
              ⚠️
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white">
            Sala nie istnieje
          </h1>

          <p className="text-slate-400 mt-3 leading-relaxed">
            Nie udało się znaleźć wybranej sali.
            Możliwe, że została usunięta.
          </p>

          <button
            onClick={() =>
              navigate("/admin/rooms")
            }
            className="
              mt-8
              w-full
              rounded-2xl
              bg-white
              text-black
              font-semibold
              py-4
              hover:scale-[1.02]
              transition
            "
          >
            Wróć do listy sal
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 lg:p-10 mb-8">

          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

          <div className="relative z-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-sm font-medium mb-6">
                  Room Editor
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                  Edytuj salę
                </h1>

                <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                  Zaktualizuj dane sali, wyposażenie oraz ustawienia rezerwacji.
                </p>

              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 px-6 py-5 backdrop-blur-xl min-w-[220px]">

                <p className="text-slate-500 text-sm mb-2">
                  Aktualnie edytujesz
                </p>

                <p className="text-xl font-bold text-white">
                  {room.name}
                </p>

                <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
                  <span>
                    ID:
                  </span>

                  <span className="text-white font-medium">
                    #{room.id}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* FORM */}

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-black/30">

          <AdminRoomForm
            initialData={room}
            onSubmit={handleUpdate}
            submitText="Zapisz zmiany"
          />

        </div>

      </div>

    </div>
  );
}

export default AdminRoomEditPage;