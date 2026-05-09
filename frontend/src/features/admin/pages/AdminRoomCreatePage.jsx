import { useNavigate } from "react-router-dom";

import AdminRoomForm from "../components/AdminRoomForm";

import { createRoom } from "../services/adminRoomService";

function AdminRoomCreatePage() {
  const navigate = useNavigate();

  async function handleCreate(data) {
    try {
      await createRoom(data);

      navigate("/admin/rooms");

    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">

        {/* HEADER */}

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 lg:p-10 mb-8">

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-sm font-medium mb-6">
              Room Management
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Utwórz nową salę
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              Dodaj nową salę do systemu rezerwacji uczelni.
              Ustaw typ, pojemność, wyposażenie oraz limity rezerwacji.
            </p>

          </div>

        </div>

        {/* FORM CONTAINER */}

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-black/30">

          <AdminRoomForm
            onSubmit={handleCreate}
            submitText="Utwórz salę"
          />

        </div>

      </div>

    </div>
  );
}

export default AdminRoomCreatePage;