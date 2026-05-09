function AdminUserTable({
  users,
  onDelete,
  deletingId,
}) {

  function getRoleLabel(role) {

    switch (role) {

      case "admin":
        return "Administrator";

      default:
        return "Użytkownik";
    }
  }


  return (
    <div className="
      overflow-hidden
      rounded-[32px]
      border border-white/10
      bg-slate-900/70
      backdrop-blur-2xl
      shadow-[0_0_40px_rgba(15,23,42,0.45)]
    ">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead className="
            border-b border-white/10
            bg-white/[0.02]
          ">

            <tr className="
              text-slate-400
              text-sm
            ">

              <th className="
                text-left
                px-6
                py-5
                font-medium
              ">
                ID
              </th>

              <th className="
                text-left
                px-6
                py-5
                font-medium
              ">
                Email
              </th>

              <th className="
                text-left
                px-6
                py-5
                font-medium
              ">
                Rola
              </th>

              <th className="
                text-right
                px-6
                py-5
                font-medium
              ">
                Akcje
              </th>

            </tr>

          </thead>


          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="
                  border-b border-white/5
                  hover:bg-white/[0.035]
                  transition-all
                  duration-200
                "
              >

                {/* ID */}

                <td className="
                  px-6
                  py-5
                  text-slate-500
                  font-medium
                ">
                  #{user.id}
                </td>


                {/* EMAIL */}

                <td className="px-6 py-5">

                  <div className="space-y-1">

                    <p className="
                      text-white
                      font-semibold
                    ">
                      {user.email}
                    </p>

                    <p className="
                      text-xs
                      text-slate-500
                    ">
                      Konto systemowe
                    </p>

                  </div>

                </td>


                {/* ROLE */}

                <td className="px-6 py-5">

                  <span className={`
                    inline-flex
                    items-center
                    px-4
                    py-2
                    rounded-2xl
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    border
                    ${
                      user.role === "admin"
                        ? `
                          border-cyan-500/20
                          bg-cyan-500/10
                          text-cyan-300
                        `
                        : `
                          border-slate-500/20
                          bg-slate-500/10
                          text-slate-300
                        `
                    }
                  `}>

                    {getRoleLabel(user.role)}

                  </span>

                </td>


                {/* ACTIONS */}

                <td className="px-6 py-5">

                  <div className="
                    flex
                    justify-end
                  ">

                    <button
                      onClick={() =>
                        onDelete(user.id)
                      }
                      disabled={
                        deletingId === user.id
                      }
                      className="
                        px-4
                        py-2.5
                        rounded-2xl
                        border border-red-500/20
                        bg-red-500/10
                        hover:bg-red-500/20
                        text-red-300
                        font-medium
                        transition-all
                        duration-200
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >

                      {
                        deletingId === user.id
                          ? "Usuwanie..."
                          : "Usuń"
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

export default AdminUserTable;