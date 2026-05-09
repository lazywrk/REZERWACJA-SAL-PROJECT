import { Link } from "react-router-dom";

function AdminRoomTable({
  rooms,
  onMaintenance,
  updatingId,
}) {

  return (
    <div className="
      overflow-hidden
      rounded-[28px]
      border border-white/10
      bg-slate-900/70
      backdrop-blur-xl
    ">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[900px]">

          <thead className="border-b border-white/10">

            <tr className="text-slate-400 text-sm">

              <th className="text-left px-6 py-5 font-medium">
                ID
              </th>

              <th className="text-left px-6 py-5 font-medium">
                Sala
              </th>

              <th className="text-left px-6 py-5 font-medium">
                Typ
              </th>

              <th className="text-left px-6 py-5 font-medium">
                Pojemność
              </th>

              <th className="text-left px-6 py-5 font-medium">
                Status
              </th>

              <th className="text-right px-6 py-5 font-medium">
                Akcje
              </th>

            </tr>

          </thead>

          <tbody>

            {rooms.map((room) => (

              <tr
                key={room.id}
                className="
                  border-b border-white/5
                  hover:bg-white/[0.03]
                  transition-colors
                "
              >

                <td className="px-6 py-5 text-slate-400">
                  #{room.id}
                </td>

                <td className="px-6 py-5">

                  <div className="font-semibold text-white">
                    {room.name}
                  </div>

                </td>

                <td className="px-6 py-5 text-slate-300">
                  {room.type}
                </td>

                <td className="px-6 py-5 text-slate-300">
                  {room.capacity}
                </td>

                <td className="px-6 py-5">

                  <span className={`
                    inline-flex
                    items-center
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium
                    border
                    ${
                      room.status === "maintenance"
                        ? "border-orange-500/20 bg-orange-500/10 text-orange-300"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    }
                  `}>
                    {
                      room.status === "maintenance"
                        ? "Konserwacja"
                        : "Dostępna"
                    }
                  </span>

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-3">

                    <Link
                      to={`/admin/rooms/${room.id}/edit`}
                      className="
                        px-4
                        py-2
                        rounded-xl
                        border border-white/10
                        bg-slate-800/80
                        hover:bg-slate-700
                        text-slate-200
                        transition-all
                      "
                    >
                      Edytuj
                    </Link>

                    <button
                      onClick={() => onMaintenance(room.id)}
                      disabled={
                        updatingId === room.id ||
                        room.status === "maintenance"
                      }
                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-orange-500
                        hover:bg-orange-400
                        text-white
                        transition-all
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >

                      {
                        updatingId === room.id
                          ? "Aktualizacja..."
                          : room.status === "maintenance"
                          ? "W konserwacji"
                          : "Konserwacja"
                      }

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminRoomTable;