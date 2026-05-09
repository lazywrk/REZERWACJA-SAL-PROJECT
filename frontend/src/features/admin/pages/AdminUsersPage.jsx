import { useEffect, useState } from "react";

import AdminUserTable from "../components/AdminUserTable";

import {
  getUsers,
  deleteUser,
} from "../services/adminUserService";


function AdminUsersPage() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState(null);


  useEffect(() => {

    async function loadUsers() {

      try {

        const data =
          await getUsers();

        setUsers(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    }

    loadUsers();

  }, []);


  async function handleDelete(id) {

    const confirmed =
      window.confirm(
        "Czy na pewno chcesz usunąć użytkownika?"
      );

    if (!confirmed) return;

    try {

      setDeletingId(id);

      await deleteUser(id);

      setUsers((prev) =>
        prev.filter(
          (user) => user.id !== id
        )
      );

    } catch (err) {

      console.error(err);

    } finally {

      setDeletingId(null);
    }
  }


  if (loading) {

    return (
      <div className="p-6 md:p-10">

        <div className="
          rounded-[28px]
          border border-white/10
          bg-slate-900/70
          backdrop-blur-xl
          p-8
          text-slate-300
        ">
          Ładowanie użytkowników...
        </div>

      </div>
    );
  }


  return (
    <div className="p-6 md:p-10 space-y-8">

      {/* HEADER */}

      <div className="
        rounded-[32px]
        border border-white/10
        bg-gradient-to-br
        from-slate-900/90
        via-slate-900/80
        to-slate-800/70
        backdrop-blur-2xl
        p-6 md:p-8
      ">

        <div className="
          flex flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
        ">

          <div>

            <p className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-cyan-300/80
              mb-3
            ">
              Panel administratora
            </p>

            <h1 className="
              text-3xl
              md:text-5xl
              font-black
              text-white
              leading-tight
            ">
              Zarządzanie użytkownikami
            </h1>

            <p className="
              mt-4
              text-slate-400
              text-sm md:text-base
              max-w-2xl
            ">
              Zarządzaj kontami użytkowników,
              rolami oraz dostępem do systemu rezerwacji.
            </p>

          </div>


          <div className="
            flex items-center gap-3
            flex-wrap
          ">

            <div className="
              px-5 py-3
              rounded-2xl
              border border-white/10
              bg-white/5
              text-slate-300
              text-sm
            ">
              Łącznie użytkowników:
              <span className="
                ml-2
                font-semibold
                text-white
              ">
                {users.length}
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* TABLE */}

      <AdminUserTable
        users={users}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

    </div>
  );
}

export default AdminUsersPage;